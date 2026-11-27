import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSettingsStore, DEFAULT_APP_SETTINGS } from "../../app/settings.js";

const legacyBudgetTableSettings = () => ({
    defaultSimpleMode: DEFAULT_APP_SETTINGS.interface.budgetTable.defaultSimpleMode,
    defaultTagEditingEnabled: DEFAULT_APP_SETTINGS.interface.budgetTable.defaultTagEditingEnabled,
    simpleModeVisibleColumns: [...DEFAULT_APP_SETTINGS.interface.budgetTable.simpleModeVisibleColumns],
});

const legacySettings = (version: number) => ({
    version,
    general: DEFAULT_APP_SETTINGS.general,
    interface: DEFAULT_APP_SETTINGS.interface,
});

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
        expect(store.get().general.automaticUpdates).toBe(true);
        expect(store.get().interface.itemForm).toEqual({
            itemReference: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: ["internalCode"],
            },
            itemValues: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: [
                    "historyPrice",
                    "discount",
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
                defaultBoardingMode: "calendarDays",
                defaultDelivery: 3,
            },
        });
    });

    it("fills item form defaults when loading a settings file from an older version", async () => {
        await writeFile(settingsPath, JSON.stringify({
            version: 1,
            interface: {
                budgetTable: legacyBudgetTableSettings(),
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
                budgetTable: legacyBudgetTableSettings(),
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

        expect(store.get().version).toBe(9);
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
                    "discount",
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
                defaultBoardingMode: "calendarDays",
                defaultDelivery: 3,
            },
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 2 settings and adds the current item value defaults", async () => {
        const version2Settings = {
            version: 2,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                budgetTable: legacyBudgetTableSettings(),
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

        expect(store.get().version).toBe(9);
        expect(store.get().interface.itemForm.itemValues).toEqual({
            defaultSimpleMode: true,
            simpleModeVisibleFields: ["ipi", "discount"],
            defaultMarkup: 40,
            defaultBoarding: 0,
            defaultBoardingMode: "calendarDays",
            defaultDelivery: 3,
        });
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 3 settings with tag editing enabled by default", async () => {
        const version3Settings = {
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

        expect(store.get().version).toBe(9);
        expect(store.get().interface.budgetTable.defaultTagEditingEnabled).toBe(true);
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 4 settings and enables automatic updates by default", async () => {
        await writeFile(settingsPath, JSON.stringify({
            version: 4,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                budgetTable: legacyBudgetTableSettings(),
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(9);
        expect(store.get().general.automaticUpdates).toBe(true);
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates the boarding display mode into existing version 5 settings", async () => {
        const version5ItemValues = Object.fromEntries(
            Object.entries(DEFAULT_APP_SETTINGS.interface.itemForm.itemValues)
                .filter(([key]) => key !== "defaultBoardingMode"),
        );
        await writeFile(settingsPath, JSON.stringify({
            ...legacySettings(5),
            version: 5,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                budgetTable: legacyBudgetTableSettings(),
                itemForm: {
                    ...DEFAULT_APP_SETTINGS.interface.itemForm,
                    itemValues: version5ItemValues,
                },
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(9);
        expect(store.get().interface.itemForm.itemValues.defaultBoardingMode).toBe("calendarDays");
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("adds the draft status default when migrating version 6 settings", async () => {
        await writeFile(settingsPath, JSON.stringify({
            ...legacySettings(6),
            version: 6,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                budgetTable: legacyBudgetTableSettings(),
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(9);
        expect(store.get().interface.budgetTable.defaultQuotationStatus).toBe(0);
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("adds the discount field to existing version 7 simple-mode preferences", async () => {
        const existingFields = DEFAULT_APP_SETTINGS.interface.itemForm.itemValues
            .simpleModeVisibleFields
            .filter((field) => field !== "discount");
        await writeFile(settingsPath, JSON.stringify({
            ...legacySettings(7),
            version: 7,
            interface: {
                ...DEFAULT_APP_SETTINGS.interface,
                itemForm: {
                    ...DEFAULT_APP_SETTINGS.interface.itemForm,
                    itemValues: {
                        ...DEFAULT_APP_SETTINGS.interface.itemForm.itemValues,
                        simpleModeVisibleFields: existingFields,
                    },
                },
            },
        }));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().version).toBe(9);
        expect(store.get().interface.itemForm.itemValues.simpleModeVisibleFields).toContain("discount");
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(store.get());
    });

    it("migrates version 8 settings and defaults to the system color scheme", async () => {
        await writeFile(settingsPath, JSON.stringify(legacySettings(8)));

        const store = createSettingsStore(settingsPath);
        await store.initialize();

        expect(store.get().appearance.colorScheme).toBe("auto");
        expect(JSON.parse(await readFile(settingsPath, "utf8"))).toEqual(DEFAULT_APP_SETTINGS);
    });

    it("persists the automatic update preference", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            general: { automaticUpdates: false },
        });

        expect(settings.general.automaticUpdates).toBe(false);

        const restartedStore = createSettingsStore(settingsPath);
        await restartedStore.initialize();
        expect(restartedStore.get().general.automaticUpdates).toBe(false);
    });

    it("rejects a non-boolean automatic update preference", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                general: { automaticUpdates: "false" as unknown as boolean },
            }),
        ).rejects.toThrow("invalid general settings");
        expect(store.get()).toEqual(initialSettings);
    });

    it("persists the selected color scheme", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            appearance: { colorScheme: "dark" },
        });

        expect(settings.appearance.colorScheme).toBe("dark");

        const restartedStore = createSettingsStore(settingsPath);
        await restartedStore.initialize();
        expect(restartedStore.get().appearance.colorScheme).toBe("dark");
    });

    it("rejects unsupported color schemes without changing settings", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                appearance: { colorScheme: "sepia" as AppColorScheme },
            }),
        ).rejects.toThrow("invalid appearance settings");
        expect(store.get()).toEqual(initialSettings);
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

    it("persists the default quotation status", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();

        const settings = await store.update({
            interface: {
                budgetTable: { defaultQuotationStatus: 2 },
            },
        });

        expect(settings.interface.budgetTable.defaultQuotationStatus).toBe(2);

        const restartedStore = createSettingsStore(settingsPath);
        await restartedStore.initialize();
        expect(restartedStore.get().interface.budgetTable.defaultQuotationStatus).toBe(2);
    });

    it("rejects unsupported default quotation statuses", async () => {
        const store = createSettingsStore(settingsPath);
        await store.initialize();
        const initialSettings = store.get();

        await expect(
            store.update({
                interface: {
                    budgetTable: {
                        defaultQuotationStatus: 4 as QuotationStatus,
                    },
                },
            }),
        ).rejects.toThrow("defaultQuotationStatus is invalid");
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
            defaultQuotationStatus: 0,
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
            defaultQuotationStatus: 0,
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
                defaultBoardingMode: "calendarDays",
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
                        defaultBoardingMode: "businessDays",
                        defaultDelivery: 8,
                    },
                },
            },
        });

        expect(settings.interface.itemForm.itemValues).toMatchObject({
            defaultMarkup: 55,
            defaultBoarding: 4,
            defaultBoardingMode: "businessDays",
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
            { defaultBoardingMode: "unknown" as BoardingInputMode },
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
