import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSettingsStore, DEFAULT_APP_SETTINGS } from "../../app/settings.js";

describe("settings store", () => {
    let directory: string;
    let settingsPath: string;

    beforeEach(async () => {
        directory = await mkdtemp(path.join(os.tmpdir(), "bear-budgets-settings-"));
        settingsPath = path.join(directory, "bear-budgets-settings.json");
    });

    afterEach(async () => {
        await rm(directory, { recursive: true, force: true });
    });

    it("creates the default settings file when it does not exist", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const savedSettings = JSON.parse(await readFile(settingsPath, "utf8")) as AppSettings;
        expect(savedSettings).toEqual(DEFAULT_APP_SETTINGS);
        expect(store.get()).toEqual(DEFAULT_APP_SETTINGS);
        expect(store.get().interface.itemForm).toEqual({
            itemReference: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: ["internalCode"],
            },
            itemValues: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: [
                    "historyPrice",
                    "boarding",
                    "delivery",
                    "purchaseShipping",
                    "totalWithoutTaxes",
                    "markupValue",
                    "ipiValue",
                    "stValue",
                    "totalWithIPIandST",
                    "totalWithAll",
                    "finalUnitValue",
                ],
                defaultMarkup: 40,
                defaultBoarding: 0,
                defaultDelivery: 3,
            },
        });
    });

    it("fills item form defaults when loading a settings file from an older version", async () => {
        await writeFile(settingsPath, JSON.stringify({
            version: 1,
            interface: {
                budgetTable: DEFAULT_APP_SETTINGS.interface.budgetTable,
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().interface.itemForm).toEqual(
            DEFAULT_APP_SETTINGS.interface.itemForm,
        );
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(
            DEFAULT_APP_SETTINGS,
        );
    });

    it("migrates existing item form preferences while preserving their selections", async () => {
        await writeFile(settingsPath, JSON.stringify({
            version: 1,
            interface: {
                budgetTable: DEFAULT_APP_SETTINGS.interface.budgetTable,
                itemForm: {
                    itemReference: {
                        defaultSimpleMode: true,
                        simpleModeVisibleFields: ["ncm"],
                    },
                    itemValues: {
                        defaultSimpleMode: true,
                        simpleModeVisibleFields: ["ipi"],
                    },
                },
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(4);
        expect(store.get().interface.budgetTable.defaultTagEditingEnabled).toBe(true);
        expect(store.get().interface.itemForm).toEqual({
            itemReference: {
                defaultSimpleMode: true,
                simpleModeVisibleFields: ["internalCode", "ncm"],
            },
            itemValues: {
                defaultSimpleMode: true,
                simpleModeVisibleFields: [
                    "historyPrice",
                    "boarding",
                    "delivery",
                    "purchaseShipping",
                    "totalWithoutTaxes",
                    "markupValue",
                    "ipiValue",
                    "stValue",
                    "totalWithIPIandST",
                    "totalWithAll",
                    "finalUnitValue",
                    "ipi",
                ],
                defaultMarkup: 40,
                defaultBoarding: 0,
                defaultDelivery: 3,
            },
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 2 settings and adds the current item value defaults", async () => {
        const version2Settings = {
            ...DEFAULT_APP_SETTINGS,
            version: 2,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                itemForm: {
                    itemReference: DEFAULT_APP_SETTINGS.interface.itemForm.itemReference,
                    itemValues: {
                        defaultSimpleMode: true,
                        simpleModeVisibleFields: ["ipi"] as ItemValuesSimpleField[],
                    },
                },
            },
        };
        await writeFile(settingsPath, JSON.stringify(version2Settings));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(4);
        expect(store.get().interface.itemForm.itemValues).toEqual({
            defaultSimpleMode: true,
            simpleModeVisibleFields: ["ipi"],
            defaultMarkup: 40,
            defaultBoarding: 0,
            defaultDelivery: 3,
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 3 settings with tag editing enabled by default", async () => {
        const version3Settings = {
            ...DEFAULT_APP_SETTINGS,
            version: 3,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                budgetTable: {
                    defaultSimpleMode: true,
                    simpleModeVisibleColumns: [...DEFAULT_APP_SETTINGS.interface.budgetTable.simpleModeVisibleColumns],
                },
            },
        };
        await writeFile(settingsPath, JSON.stringify(version3Settings));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(4);
        expect(store.get().interface.budgetTable.defaultTagEditingEnabled).toBe(true);
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("persists the default tag editing preference", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            interface: {
                budgetTable: { defaultTagEditingEnabled: true },
            },
        });

        expect(settings.interface.budgetTable.defaultTagEditingEnabled).toBe(true);

        const restartedStore = createSettingsStore(settingsPath);
        await restartedStore.initialize();
        expect(restartedStore.get().interface.budgetTable.defaultTagEditingEnabled).toBe(true);
    });

    it("rejects a non-boolean default tag editing preference", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                interface: {
                    budgetTable: {
                        defaultTagEditingEnabled: "true" as unknown as boolean,
                    },
                },
            }),
        ).rejects.toThrow("defaultTagEditingEnabled must be a boolean");
        expect(store.get()).toEqual(initialSettings);
    });

    it("persists partial updates while preserving other preferences", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        await store.update({
            interface: { budgetTable: { defaultSimpleMode: false } },
        });
        const settings = await store.update({
            interface: { budgetTable: { simpleModeVisibleColumns: [] } },
        });

        expect(settings.interface.budgetTable).toEqual({
            defaultSimpleMode: false,
            defaultTagEditingEnabled: true,
            simpleModeVisibleColumns: [],
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(settings);

        const restartedStore = createSettingsStore(settingsPath);
        await restartedStore.initialize();
        expect(restartedStore.get()).toEqual(settings);
    });

    it("serializes concurrent updates without losing changes", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        await Promise.all([
            store.update({ interface: { budgetTable: { defaultSimpleMode: false } } }),
            store.update({ interface: { budgetTable: { simpleModeVisibleColumns: [] } } }),
        ]);

        expect(store.get().interface.budgetTable).toEqual({
            defaultSimpleMode: false,
            defaultTagEditingEnabled: true,
            simpleModeVisibleColumns: [],
        });
    });

    it("persists separate simple mode preferences for reference and values", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            interface: {
                itemForm: {
                    itemReference: {
                        defaultSimpleMode: true,
                        simpleModeVisibleFields: ["manufacturerCode", "notes"],
                    },
                    itemValues: {
                        defaultSimpleMode: true,
                        simpleModeVisibleFields: ["ipi", "extraValue"],
                    },
                },
            },
        });

        expect(settings.interface.itemForm).toEqual({
            itemReference: {
                defaultSimpleMode: true,
                simpleModeVisibleFields: ["manufacturerCode", "notes"],
            },
            itemValues: {
                defaultSimpleMode: true,
                simpleModeVisibleFields: ["ipi", "extraValue"],
                defaultMarkup: 40,
                defaultBoarding: 0,
                defaultDelivery: 3,
            },
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(settings);
    });

    it("persists custom default values for new items", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            interface: {
                itemForm: {
                    itemValues: {
                        defaultMarkup: 55,
                        defaultBoarding: 4,
                        defaultDelivery: 8,
                    },
                },
            },
        });

        expect(settings.interface.itemForm.itemValues).toMatchObject({
            defaultMarkup: 55,
            defaultBoarding: 4,
            defaultDelivery: 8,
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(settings);
    });

    it("rejects out-of-range or fractional default values without changing settings", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        const invalidValues = [
            { defaultMarkup: -1 },
            { defaultMarkup: 1001 },
            { defaultMarkup: 40.5 },
            { defaultBoarding: -1 },
            { defaultBoarding: 2.5 },
            { defaultDelivery: -1 },
            { defaultDelivery: 1.5 },
        ];

        for (const value of invalidValues) {
            await expect(
                store.update({
                    interface: {
                        itemForm: { itemValues: value },
                    },
                }),
            ).rejects.toThrow("is invalid");
            expect(store.get()).toEqual(initialSettings);
        }
    });

    it("rejects duplicate columns without changing the saved settings", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                interface: {
                    budgetTable: {
                        simpleModeVisibleColumns: ["description", "description"],
                    },
                },
            }),
        ).rejects.toThrow("cannot contain duplicates");

        expect(store.get()).toEqual(initialSettings);
    });

    it("rejects invalid item form fields without changing the saved settings", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                interface: {
                    itemForm: {
                        itemValues: {
                            simpleModeVisibleFields: ["unknown-field" as ItemValuesSimpleField],
                        },
                    },
                },
            }),
        ).rejects.toThrow("contains an unsupported field");

        expect(store.get()).toEqual(initialSettings);
    });

    it("does not overwrite an invalid existing settings file", async () => {
        await writeFile(settingsPath, "{invalid json", "utf8");
        const store = createSettingsStore(settingsPath);

        await expect(store.initialize()).rejects.toThrow();
        expect(await readFile(settingsPath, "utf8")).toBe("{invalid json");
    });
});
