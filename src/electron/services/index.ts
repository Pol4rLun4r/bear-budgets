import type { Database } from "better-sqlite3";

// quotation
import createQuotationService from "./quotation/createQuotation.service.js";

// item

export const createServices = (db: Database) => ({
    quotation: {
        create: createQuotationService(db),
    },
    item: {

    }
})

export type Services = ReturnType<typeof createServices>;