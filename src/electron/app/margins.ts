import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKeys = (value: Record<string, unknown>, keys: string[]): boolean =>
    Object.keys(value).every((key) => keys.includes(key));

const isErrorWithCode = (error: unknown, code: string): boolean =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code;

const isMarginId = (value: unknown): value is string =>
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const validateNewMargin = (value: unknown): NewCustomMargin => {
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, ["name", "percentage"]) ||
        typeof value.name !== "string" ||
        typeof value.percentage !== "number" ||
        !Number.isSafeInteger(value.percentage) ||
        value.percentage < 0 ||
        value.percentage > 1000
    ) {
        throw new Error("Invalid custom margin: provide a name and a whole percentage from 0 to 1000.");
    }

    const name = value.name.trim();
    if (name.length === 0 || name.length > 80) {
        throw new Error("Invalid custom margin: the name must contain 1 to 80 characters.");
    }

    return { name, percentage: value.percentage };
};

const validateMargins = (value: unknown): CustomMargin[] => {
    if (!Array.isArray(value)) {
        throw new Error("Invalid margins file: expected a list of custom margins.");
    }

    const margins = value.map((entry): CustomMargin => {
        if (
            !isRecord(entry) ||
            !hasOnlyKeys(entry, ["id", "name", "percentage"]) ||
            !isMarginId(entry.id) ||
            typeof entry.name !== "string" ||
            typeof entry.percentage !== "number"
        ) {
            throw new Error("Invalid margins file: a custom margin entry is malformed.");
        }

        const margin = validateNewMargin({
            name: entry.name,
            percentage: entry.percentage,
        });
        return { id: entry.id, ...margin };
    });

    if (
        new Set(margins.map(({ id }) => id)).size !== margins.length ||
        new Set(margins.map(({ name }) => name.toLowerCase())).size !== margins.length
    ) {
        throw new Error("Invalid margins file: IDs and names must be unique.");
    }

    return margins;
};

const persistMargins = async (filePath: string, margins: CustomMargin[]): Promise<void> => {
    await mkdir(path.dirname(filePath), { recursive: true });

    const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
        await writeFile(temporaryPath, `${JSON.stringify(margins, null, 2)}\n`, {
            encoding: "utf8",
            flag: "wx",
        });
        await rename(temporaryPath, filePath);
    } catch (error) {
        try {
            await unlink(temporaryPath);
        } catch (cleanupError) {
            if (!isErrorWithCode(cleanupError, "ENOENT")) {
                console.error("Failed to remove temporary margins file:", cleanupError);
            }
        }
        throw error;
    }
};

export const createMarginsStore = (filePath: string) => {
    let currentMargins: CustomMargin[] | undefined;
    let writeQueue = Promise.resolve();

    const initialize = async (): Promise<void> => {
        let contents: string;
        try {
            contents = await readFile(filePath, "utf8");
        } catch (error) {
            if (!isErrorWithCode(error, "ENOENT")) {
                throw error;
            }

            await persistMargins(filePath, []);
            currentMargins = [];
            return;
        }

        const parsedMargins: unknown = JSON.parse(contents);
        currentMargins = validateMargins(parsedMargins);
    };

    const get = (): CustomMargin[] => {
        if (!currentMargins) {
            throw new Error("Margins store has not been initialized.");
        }
        return currentMargins.map((margin) => ({ ...margin }));
    };

    const add = (input: unknown): Promise<CustomMargin[]> => {
        const operation = writeQueue.then(async () => {
            if (!currentMargins) {
                throw new Error("Margins store has not been initialized.");
            }

            const margin = validateNewMargin(input);
            if (
                currentMargins.some(
                    (existing) =>
                        existing.name.toLowerCase() === margin.name.toLowerCase(),
                )
            ) {
                throw new Error("A custom margin with this name already exists.");
            }

            const nextMargins = [
                ...currentMargins,
                { id: randomUUID(), ...margin },
            ];
            await persistMargins(filePath, nextMargins);
            currentMargins = nextMargins;
            return get();
        });

        writeQueue = operation.then(() => undefined, () => undefined);
        return operation;
    };

    const remove = (id: unknown): Promise<CustomMargin[]> => {
        const operation = writeQueue.then(async () => {
            if (!currentMargins) {
                throw new Error("Margins store has not been initialized.");
            }
            if (typeof id !== "string" || id.length === 0) {
                throw new Error("Invalid custom margin ID.");
            }

            const nextMargins = currentMargins.filter((margin) => margin.id !== id);
            if (nextMargins.length === currentMargins.length) {
                throw new Error("Custom margin not found.");
            }

            await persistMargins(filePath, nextMargins);
            currentMargins = nextMargins;
            return get();
        });

        writeQueue = operation.then(() => undefined, () => undefined);
        return operation;
    };

    return { initialize, get, add, remove };
};
