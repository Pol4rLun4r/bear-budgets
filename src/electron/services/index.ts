import type { Database } from "better-sqlite3";

// client
import createClientService from "./createClient.service.js";
import searchClientsService from "./searchClients.service.js";

// quotation
import createQuotationService from "./createQuotation.service.js";
import createQuotationWithItemsService from "./createQuotationWithItems.service.js";

// item
import searchItemDescriptionService from "./searchItemDescription.service.js";

export const createServices = (db: Database) => ({
    client: {
        create: createClientService(db),
        search: searchClientsService(db)
    },
    quotation: {
        create: createQuotationService(db),
        createWithItems: createQuotationWithItemsService(db)
    },
    item: {
        searchDescription: searchItemDescriptionService(db)
    }
})

export type Services = ReturnType<typeof createServices>;