// database
import type { Database } from "better-sqlite3";

// services
import { createServices } from "../services/index.js";

// utils
import { ipcMainHandle } from "../utils/electron.js";

const quotationHandlers = (db: Database) => {
    const services = createServices(db);

    ipcMainHandle('quotation:create', services.quotation.create);
    ipcMainHandle('quotation:createWithItems', services.quotation.createWithItems)   
}

export default quotationHandlers;