import type { Database } from "better-sqlite3";

// handlers
import quotationHandlers from "./quotation.handlers.js";
import itemHandlers from "./item.handlers.js";
import windowHandlers from "./window.handlers.js";
import updaterHandlers from "./updater.handlers.js";
import changeLogHandlers from "./changeLog.handlers.js";

const ipcHandlers = (db: Database) => {
    windowHandlers();
    updaterHandlers();
    changeLogHandlers();
    quotationHandlers(db);
    itemHandlers(db);
};

export default ipcHandlers;