import type { Database } from "better-sqlite3";

// quotation
import createQuotationService from "./quotation/createQuotation.service.js";
import getAllQuotationsSummaryService from "./quotation/getAllQuotationsSummary.service.js";
import getQuotationFullService from "./quotation/getQuotationFull.service.js";
import updateQuotationLineService from "./quotation/updateQuotationLine.service.js";

// item
import searchDescriptionService from "./item/searchDescription.service.js";
import findItemReferences from "./item/findItemReferences.service.js";
import getReferenceLinksService from "./item/getReferenceLinks.service.js";
import getAllItemValuesByReferenceIdService from "./item/getAllItemValuesByReferenceId.service.js";
import addToQuotationService from "./item/addToQuotation.service.js";

export const createServices = (db: Database) => ({
    quotation: {
        create: createQuotationService(db),
        getAllSummary: getAllQuotationsSummaryService(db),
        getFull: getQuotationFullService(db),
        updateLine: updateQuotationLineService(db)
    },
    item: {
        searchDescription: searchDescriptionService(db),
        findItemReferences: findItemReferences(db),
        getReferenceLinks: getReferenceLinksService(db),
        getAllItemValuesByReferenceId: getAllItemValuesByReferenceIdService(db),
        addToQuotation: addToQuotationService(db)
    }
})

export type Services = ReturnType<typeof createServices>;