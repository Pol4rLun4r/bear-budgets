import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const budgetTableColumns = new Set<string>([
    "description",
    "internalCode",
    "unitPrice",
    "quantity",
    "totalWithAdditions",
    "shippingAndDelivery",
    "markupPercentage",
    "totalWithoutAdditions",
    "unitPriceWithoutAdditions",
    "unitMarkup",
    "totalMarkup",
    "st",
    "ipiPercentage",
    "ipiValue",
    "purchaseShipping",
    "extraValue",
    "totalWithIpiAndSt",
]);

const itemReferenceSimpleFields = new Set<string>([
    "internalCode",
    "manufacturerCode",
    "ncm",
    "notes",
    "links",
]);

const itemValuesSimpleFields = new Set<string>([
    "historyPrice",
    "ipi",
    "st",
    "extraValue",
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
]);

const legacyItemReferenceSimpleFields = new Set<string>([
    "manufacturerCode",
    "ncm",
    "notes",
    "links",
]);
const legacyItemValuesSimpleFields = new Set<string>(["ipi", "st", "extraValue"]);
const defaultItemReferenceSimpleFields: ItemReferenceSimpleField[] = ["internalCode"];
const defaultItemValuesSimpleFields: ItemValuesSimpleField[] = [
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
];
const defaultItemValueDefaults = {
    defaultMarkup: 40,
    defaultBoarding: 0,
    defaultDelivery: 3,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
    version: 4,
    interface: {
        budgetTable: {
            defaultSimpleMode: true,
            defaultTagEditingEnabled: false,
            simpleModeVisibleColumns: [
                "description",
                "internalCode",
                "unitPrice",
                "quantity",
                "totalWithAdditions",
                "shippingAndDelivery",
                "markupPercentage",
            ],
        },
        itemForm: {
            itemReference: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: [...defaultItemReferenceSimpleFields],
            },
            itemValues: {
                defaultSimpleMode: false,
                simpleModeVisibleFields: [...defaultItemValuesSimpleFields],
                ...defaultItemValueDefaults,
            },
        },
    },
};

const cloneSettings = (settings: AppSettings): AppSettings => ({
    version: settings.version,
    interface: {
        budgetTable: {
            defaultSimpleMode: settings.interface.budgetTable.defaultSimpleMode,
            defaultTagEditingEnabled: settings.interface.budgetTable.defaultTagEditingEnabled,
            simpleModeVisibleColumns: [...settings.interface.budgetTable.simpleModeVisibleColumns],
        },
        itemForm: {
            itemReference: {
                defaultSimpleMode: settings.interface.itemForm.itemReference.defaultSimpleMode,
                simpleModeVisibleFields: [
                    ...settings.interface.itemForm.itemReference.simpleModeVisibleFields,
                ],
            },
            itemValues: {
                defaultSimpleMode: settings.interface.itemForm.itemValues.defaultSimpleMode,
                simpleModeVisibleFields: [
                    ...settings.interface.itemForm.itemValues.simpleModeVisibleFields,
                ],
                defaultMarkup: settings.interface.itemForm.itemValues.defaultMarkup,
                defaultBoarding: settings.interface.itemForm.itemValues.defaultBoarding,
                defaultDelivery: settings.interface.itemForm.itemValues.defaultDelivery,
            },
        },
    },
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKeys = (value: Record<string, unknown>, keys: string[]): boolean =>
    Object.keys(value).every((key) => keys.includes(key));

const isBudgetTableColumn = (value: unknown): value is BudgetTableColumn =>
    typeof value === "string" && budgetTableColumns.has(value);

const validateColumns = (value: unknown): BudgetTableColumn[] => {
    if (!Array.isArray(value) || !value.every(isBudgetTableColumn)) {
        throw new Error("Invalid settings: simpleModeVisibleColumns contains an unsupported column.");
    }

    if (new Set(value).size !== value.length) {
        throw new Error("Invalid settings: simpleModeVisibleColumns cannot contain duplicates.");
    }

    return [...value];
};

const validateSimpleFields = <T extends string>(
    value: unknown,
    allowedFields: Set<string>,
    settingName: string,
): T[] => {
    if (
        !Array.isArray(value) ||
        !value.every((field) => typeof field === "string" && allowedFields.has(field))
    ) {
        throw new Error(`Invalid settings: ${settingName} contains an unsupported field.`);
    }

    if (new Set(value).size !== value.length) {
        throw new Error(`Invalid settings: ${settingName} cannot contain duplicates.`);
    }

    return [...value] as T[];
};

const validateDefaultItemValue = (
    key: string,
    value: unknown,
    settingName: string,
): number => {
    const isMarkup = key === "defaultMarkup";
    if (
        typeof value !== "number" ||
        !Number.isSafeInteger(value) ||
        value < 0 ||
        (isMarkup && value > 1000)
    ) {
        throw new Error(`${settingName}.${key} is invalid.`);
    }

    return value;
};

const validateSimpleFormSettings = <
   T extends string,
   TDefaults extends {
       defaultSimpleMode: boolean;
       simpleModeVisibleFields: T[];
   },
>(
   value: unknown,
   allowedFields: Set<string>,
   settingName: string,
   defaults: TDefaults,
   numericDefaults: Record<string, number> = {},
): Omit<TDefaults, "simpleModeVisibleFields"> & {
   defaultSimpleMode: boolean;
   simpleModeVisibleFields: T[];
} => {
    if (value === undefined) {
        return { ...defaults, simpleModeVisibleFields: [...defaults.simpleModeVisibleFields] };
    }

    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, [
            "defaultSimpleMode",
            "simpleModeVisibleFields",
            ...Object.keys(numericDefaults),
        ]) ||
        typeof value.defaultSimpleMode !== "boolean"
    ) {
        throw new Error(`Invalid settings file: invalid ${settingName} settings.`);
    }

    const validatedSettings = {
        ...defaults,
        defaultSimpleMode: value.defaultSimpleMode,
        simpleModeVisibleFields: validateSimpleFields<T>(
            value.simpleModeVisibleFields,
            allowedFields,
            `${settingName}.simpleModeVisibleFields`,
        ),
    };
    for (const key of Object.keys(numericDefaults)) {
        const numericValue = validateDefaultItemValue(
            key,
            value[key],
            `Invalid settings file: ${settingName}`,
        );
        Object.assign(validatedSettings, { [key]: numericValue });
    }

    return validatedSettings;
};

const validateSettings = (value: unknown): AppSettings => {
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, ["version", "interface"]) ||
        (value.version !== 1 && value.version !== 2 && value.version !== 3 && value.version !== 4)
    ) {
        throw new Error("Invalid settings file: unsupported or missing version.");
    }
    const isLegacyVersion = value.version === 1;
    const hasItemValueDefaults = value.version >= 3;
    const hasTagVisibilityDefault = value.version === 4;

    const interfaceSettings = value.interface;
    if (
        !isRecord(interfaceSettings) ||
        !hasOnlyKeys(interfaceSettings, ["budgetTable", "itemForm"])
    ) {
        throw new Error("Invalid settings file: invalid interface settings.");
    }

    const budgetTable = interfaceSettings.budgetTable;
    if (
        !isRecord(budgetTable) ||
        !hasOnlyKeys(budgetTable, [
            "defaultSimpleMode",
            "defaultTagEditingEnabled",
            "simpleModeVisibleColumns",
        ]) ||
        typeof budgetTable.defaultSimpleMode !== "boolean" ||
        ("defaultTagEditingEnabled" in budgetTable &&
            typeof budgetTable.defaultTagEditingEnabled !== "boolean") ||
        (hasTagVisibilityDefault && typeof budgetTable.defaultTagEditingEnabled !== "boolean")
    ) {
        throw new Error("Invalid settings file: invalid budget table settings.");
    }

    const itemForm = interfaceSettings.itemForm;
    if (
        itemForm !== undefined &&
        (!isRecord(itemForm) || !hasOnlyKeys(itemForm, ["itemReference", "itemValues"]))
    ) {
        throw new Error("Invalid settings file: invalid item form settings.");
    }

    const validatedSettings: AppSettings = {
        version: 4,
        interface: {
            budgetTable: {
                defaultSimpleMode: budgetTable.defaultSimpleMode,
                defaultTagEditingEnabled: typeof budgetTable.defaultTagEditingEnabled === "boolean"
                    ? budgetTable.defaultTagEditingEnabled
                    : false,
                simpleModeVisibleColumns: validateColumns(budgetTable.simpleModeVisibleColumns),
            },
            itemForm: isLegacyVersion && itemForm === undefined
                ? {
                    itemReference: {
                        ...DEFAULT_APP_SETTINGS.interface.itemForm.itemReference,
                        simpleModeVisibleFields: [...defaultItemReferenceSimpleFields],
                    },
                    itemValues: {
                        ...DEFAULT_APP_SETTINGS.interface.itemForm.itemValues,
                        simpleModeVisibleFields: [...defaultItemValuesSimpleFields],
                    },
                }
                : {
                    itemReference: validateSimpleFormSettings<
                        ItemReferenceSimpleField,
                        typeof DEFAULT_APP_SETTINGS.interface.itemForm.itemReference
                    >(
                        isRecord(itemForm) ? itemForm.itemReference : undefined,
                        isLegacyVersion ? legacyItemReferenceSimpleFields : itemReferenceSimpleFields,
                        "itemReference",
                        isLegacyVersion
                            ? { defaultSimpleMode: false, simpleModeVisibleFields: [] }
                            : DEFAULT_APP_SETTINGS.interface.itemForm.itemReference,
                    ),
                    itemValues: validateSimpleFormSettings<
                        ItemValuesSimpleField,
                        typeof DEFAULT_APP_SETTINGS.interface.itemForm.itemValues
                    >(
                        isRecord(itemForm) ? itemForm.itemValues : undefined,
                        isLegacyVersion ? legacyItemValuesSimpleFields : itemValuesSimpleFields,
                        "itemValues",
                        isLegacyVersion
                            ? {
                                defaultSimpleMode: false,
                                simpleModeVisibleFields: [],
                                ...defaultItemValueDefaults,
                            }
                            : DEFAULT_APP_SETTINGS.interface.itemForm.itemValues,
                        hasItemValueDefaults ? defaultItemValueDefaults : {},
                    ),
                },
            },
    };

    if (!isLegacyVersion) return validatedSettings;

    const legacyItemForm = validatedSettings.interface.itemForm;
    return {
            ...validatedSettings,
            version: 4,
            interface: {
                ...validatedSettings.interface,
                itemForm: {
                    itemReference: {
                        ...legacyItemForm.itemReference,
                        simpleModeVisibleFields: [
                            ...new Set([
                                ...defaultItemReferenceSimpleFields,
                                ...legacyItemForm.itemReference.simpleModeVisibleFields,
                            ]),
                        ],
                    },
                    itemValues: {
                        ...legacyItemForm.itemValues,
                        simpleModeVisibleFields: [
                            ...new Set([
                                ...defaultItemValuesSimpleFields,
                                ...legacyItemForm.itemValues.simpleModeVisibleFields,
                            ]),
                        ],
                    },
                },
            },
    };
};

const validateSimpleFormUpdate = <T extends string>(
    value: unknown,
    allowedFields: Set<string>,
    settingName: string,
    allowItemValueDefaults = false,
): {
    defaultSimpleMode?: boolean;
    simpleModeVisibleFields?: T[];
    defaultMarkup?: number;
    defaultBoarding?: number;
    defaultDelivery?: number;
} => {
    const allowedSimpleFormKeys = [
        "defaultSimpleMode",
        "simpleModeVisibleFields",
        ...(allowItemValueDefaults ? Object.keys(defaultItemValueDefaults) : []),
    ];
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, allowedSimpleFormKeys)
    ) {
        throw new Error(`Invalid settings update: invalid ${settingName} settings.`);
    }

    const update: {
        defaultSimpleMode?: boolean;
        simpleModeVisibleFields?: T[];
        defaultMarkup?: number;
        defaultBoarding?: number;
        defaultDelivery?: number;
    } = {};
    if ("defaultSimpleMode" in value) {
        if (typeof value.defaultSimpleMode !== "boolean") {
            throw new Error(
                `Invalid settings update: ${settingName}.defaultSimpleMode must be a boolean.`,
            );
        }
        update.defaultSimpleMode = value.defaultSimpleMode;
    }
    if ("simpleModeVisibleFields" in value) {
        update.simpleModeVisibleFields = validateSimpleFields(
            value.simpleModeVisibleFields,
            allowedFields,
            `${settingName}.simpleModeVisibleFields`,
        );
    }
    if (allowItemValueDefaults) {
        for (const key of Object.keys(defaultItemValueDefaults)) {
            if (!(key in value)) continue;

            const numericValue = validateDefaultItemValue(
                key,
                value[key],
                `Invalid settings update: ${settingName}`,
            );

            if (key === "defaultMarkup") update.defaultMarkup = numericValue;
            if (key === "defaultBoarding") update.defaultBoarding = numericValue;
            if (key === "defaultDelivery") update.defaultDelivery = numericValue;
        }
    }
    if (Object.keys(update).length === 0) {
        throw new Error(`Invalid settings update: ${settingName} settings are empty.`);
    }

    return update;
};

const validateUpdate = (value: unknown): SettingsUpdate => {
    const allowedBudgetTableKeys = [
        "defaultSimpleMode",
        "defaultTagEditingEnabled",
        "simpleModeVisibleColumns",
    ];
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, ["interface"]) ||
        !isRecord(value.interface) ||
        !hasOnlyKeys(value.interface, ["budgetTable", "itemForm"])
    ) {
        throw new Error("Invalid settings update.");
    }

    const interfaceUpdate: NonNullable<SettingsUpdate["interface"]> = {};

    if ("budgetTable" in value.interface) {
        const budgetTable = value.interface.budgetTable;
        if (
            !isRecord(budgetTable) ||
            !hasOnlyKeys(budgetTable, allowedBudgetTableKeys)
        ) {
            throw new Error("Invalid settings update: invalid budget table settings.");
        }

        const update: NonNullable<SettingsUpdate["interface"]>["budgetTable"] = {};
        if ("defaultSimpleMode" in budgetTable) {
            if (typeof budgetTable.defaultSimpleMode !== "boolean") {
                throw new Error("Invalid settings update: defaultSimpleMode must be a boolean.");
            }
            update.defaultSimpleMode = budgetTable.defaultSimpleMode;
        }
        if ("defaultTagEditingEnabled" in budgetTable) {
            if (typeof budgetTable.defaultTagEditingEnabled !== "boolean") {
                throw new Error("Invalid settings update: defaultTagEditingEnabled must be a boolean.");
            }
            update.defaultTagEditingEnabled = budgetTable.defaultTagEditingEnabled;
        }
        if ("simpleModeVisibleColumns" in budgetTable) {
            update.simpleModeVisibleColumns = validateColumns(budgetTable.simpleModeVisibleColumns);
        }
        if (Object.keys(update).length === 0) {
            throw new Error("Invalid settings update: budget table settings are empty.");
        }
        interfaceUpdate.budgetTable = update;
    }

    if ("itemForm" in value.interface) {
        const itemForm = value.interface.itemForm;
        if (
            !isRecord(itemForm) ||
            !hasOnlyKeys(itemForm, ["itemReference", "itemValues"])
        ) {
            throw new Error("Invalid settings update: invalid item form settings.");
        }

        const itemFormUpdate: NonNullable<SettingsUpdate["interface"]>["itemForm"] = {};
        if ("itemReference" in itemForm) {
            itemFormUpdate.itemReference = validateSimpleFormUpdate<ItemReferenceSimpleField>(
                itemForm.itemReference,
                itemReferenceSimpleFields,
                "itemReference",
            );
        }
        if ("itemValues" in itemForm) {
            itemFormUpdate.itemValues = validateSimpleFormUpdate<ItemValuesSimpleField>(
                itemForm.itemValues,
                itemValuesSimpleFields,
                "itemValues",
                true,
            );
        }
        if (Object.keys(itemFormUpdate).length === 0) {
            throw new Error("Invalid settings update: item form settings are empty.");
        }
        interfaceUpdate.itemForm = itemFormUpdate;
    }

    if (Object.keys(interfaceUpdate).length === 0) {
        throw new Error("Invalid settings update: at least one setting is required.");
    }

    return { interface: interfaceUpdate };
};

const isErrorWithCode = (error: unknown, code: string): boolean =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code;

const persistSettings = async (filePath: string, settings: AppSettings): Promise<void> => {
    await mkdir(path.dirname(filePath), { recursive: true });

    const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
        await writeFile(temporaryPath, `${JSON.stringify(settings, null, 2)}\n`, {
            encoding: "utf8",
            flag: "wx",
        });
        await rename(temporaryPath, filePath);
    } catch (error) {
        try {
            await unlink(temporaryPath);
        } catch (cleanupError) {
            if (!isErrorWithCode(cleanupError, "ENOENT")) {
                console.error("Failed to remove temporary settings file:", cleanupError);
            }
        }
        throw error;
    }
};

export const createSettingsStore = (filePath: string) => {
    let currentSettings: AppSettings | undefined;
    let writeQueue = Promise.resolve();

    const initialize = async (): Promise<void> => {
        let contents: string;
        try {
            contents = await readFile(filePath, "utf8");
        } catch (error) {
            if (!isErrorWithCode(error, "ENOENT")) {
                throw error;
            }

            const defaults = cloneSettings(DEFAULT_APP_SETTINGS);
            await persistSettings(filePath, defaults);
            currentSettings = defaults;
            return;
        }

        const parsedSettings: unknown = JSON.parse(contents);
        const settings = validateSettings(parsedSettings);
        if (isRecord(parsedSettings) && parsedSettings.version !== 4) {
            await persistSettings(filePath, settings);
        }
        currentSettings = settings;
    };

    const get = (): AppSettings => {
        if (!currentSettings) {
            throw new Error("Settings store has not been initialized.");
        }
        return cloneSettings(currentSettings);
    };

    const update = (input: SettingsUpdate): Promise<AppSettings> => {
        const operation = writeQueue.then(async () => {
            if (!currentSettings) {
                throw new Error("Settings store has not been initialized.");
            }

            const settingsUpdate = validateUpdate(input);
            const budgetTableUpdate = settingsUpdate.interface?.budgetTable;
            const itemFormUpdate = settingsUpdate.interface?.itemForm;
            const nextSettings = validateSettings({
                ...currentSettings,
                interface: {
                    ...currentSettings.interface,
                    ...(budgetTableUpdate && {
                        budgetTable: {
                            ...currentSettings.interface.budgetTable,
                            ...budgetTableUpdate,
                        },
                    }),
                    ...(itemFormUpdate && {
                        itemForm: {
                            itemReference: {
                                ...currentSettings.interface.itemForm.itemReference,
                                ...itemFormUpdate.itemReference,
                            },
                            itemValues: {
                                ...currentSettings.interface.itemForm.itemValues,
                                ...itemFormUpdate.itemValues,
                            },
                        },
                    }),
                },
            });

            await persistSettings(filePath, nextSettings);
            currentSettings = nextSettings;
            return cloneSettings(currentSettings);
        });

        writeQueue = operation.then(() => undefined, () => undefined);
        return operation;
    };

    return { initialize, get, update };
};
