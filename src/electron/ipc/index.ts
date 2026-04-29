import type { Database } from "better-sqlite3";

// handlers
import quotationHandlers from "./quotation.handlers.js";
import clientHandlers from "./client.handlers.js";
import itemHandlers from "./item.handlers.js";

const ipcHandlers = (db: Database) => {
    clientHandlers(db);
    quotationHandlers(db);
    itemHandlers(db);
};

export default ipcHandlers;