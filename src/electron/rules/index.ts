// item rules
import createAndAddItem from "./item/createAndAdd.js";
import searchDescriptionRules from "./item/searchDescription.js";

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
        searchDescription: searchDescriptionRules
    }
});

export type Rules = ReturnType<typeof createRules>;