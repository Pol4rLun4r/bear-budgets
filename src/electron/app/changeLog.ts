import { app } from "electron";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface ChangeLogState {
    version: string;
    unread: boolean;
}

interface PersistedChangeLogState {
    lastReadVersion: string;
}

const getStatePath = () => path.join(app.getPath("userData"), "change-log-state.json");

export const getChangeLogState = async (): Promise<ChangeLogState> => {
    const version = app.getVersion();

    let fileContent: string;
    try {
        fileContent = await readFile(getStatePath(), "utf8");
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ENOENT"
        ) {
            return { version, unread: true };
        }

        throw error;
    }

    const persistedState: unknown = JSON.parse(fileContent);
    if (
        typeof persistedState !== "object" ||
        persistedState === null ||
        !("lastReadVersion" in persistedState) ||
        typeof persistedState.lastReadVersion !== "string"
    ) {
        throw new Error("Invalid persisted change log state.");
    }

    return {
        version,
        unread: persistedState.lastReadVersion !== version,
    };
};

export const markChangeLogAsRead = async (): Promise<void> => {
    const statePath = getStatePath();
    const persistedState: PersistedChangeLogState = {
        lastReadVersion: app.getVersion(),
    };

    await mkdir(path.dirname(statePath), { recursive: true });
    await writeFile(statePath, JSON.stringify(persistedState, null, 2), "utf8");
};
