// database
import type { Database } from "better-sqlite3";

// services
import { createServices } from "../services/index.js";

// utils
import { ipcMainHandle } from "../utils/electron.js";

const itemHandlers = (db: Database) => {
    const services = createServices(db);

    ipcMainHandle('item:searchDescription', services.item.searchDescription);
    ipcMainHandle('item:findItemReferences', services.item.findItemReferences);
    ipcMainHandle('item:getAllValuesByReferenceId', services.item.getAllItemValuesByReferenceId);
    ipcMainHandle('item:getReferenceLinks', services.item.getReferenceLinks);
};

export default itemHandlers;