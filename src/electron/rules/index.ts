// item rules
import createAndAddItem from "./item/createAndAdd.js";

// quotation rules
import createQuotation from "./quotation/create.js";

export const createRules = () => ({
    quotation: {
        create: createQuotation
    },
    item: {
        createAndAdd: createAndAddItem,
    }
});

export type Rules = ReturnType<typeof createRules>;