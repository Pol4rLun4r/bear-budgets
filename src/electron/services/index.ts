import type { Database } from "better-sqlite3";

// quotation
import createQuotationService from "./quotation/createQuotation.service.js";
import getAllQuotationsSummaryService from "./quotation/getAllQuotationsSummary.service.js";
import getQuotationFullService from "./quotation/getQuotationFull.service.js";

// item


export const createServices = (db: Database) => ({
    quotation: {
        create: createQuotationService(db),
        getAllSummary: getAllQuotationsSummaryService(db),
        getFull: getQuotationFullService(db)
    },
    item: {

    }
})

export type Services = ReturnType<typeof createServices>;