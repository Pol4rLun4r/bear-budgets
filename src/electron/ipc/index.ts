import type { Database } from "better-sqlite3";

// handlers
import quotationHandlers from "./quotation.handlers.js";
import itemHandlers from "./item.handlers.js";
import windowHandlers from "./window.handlers.js";
import updaterHandlers from "./updater.handlers.js";
import changeLogHandlers from "./changeLog.handlers.js";
import settingsHandlers from "./settings.handlers.js";
import type { createSettingsStore } from "../app/settings.js";

const ipcHandlers = (db: Database, settingsStore: ReturnType<typeof createSettingsStore>) => {
    windowHandlers();
    updaterHandlers();
    changeLogHandlers();
    settingsHandlers(settingsStore);
    quotationHandlers(db);
    itemHandlers(db);
};

export default ipcHandlers;