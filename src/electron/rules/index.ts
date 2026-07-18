// item rules
import createAndAddItem from "./item/createAndAdd.js";
import searchDescriptionRules from "./item/searchDescription.js";
import findItemReferencesRules from "./item/findItemReferences.js";
import getReferenceLinksRules from "./item/getReferenceLinks.js";

// quotation rules
import createQuotation from "./quotation/create.js";
import getQuotationFullRules from "./quotation/getFull.js";

export const createRules = () => ({
    quotation: {
        create: createQuotation,
        getFull: getQuotationFullRules
    },
    item: {
        createAndAdd: createAndAddItem,
        searchDescription: searchDescriptionRules,
        findItemReferences: findItemReferencesRules,
        getReferenceLinks: getReferenceLinksRules
    }
});

export type Rules = ReturnType<typeof createRules>;