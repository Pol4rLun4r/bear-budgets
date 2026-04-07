import type { Database } from "better-sqlite3";
import type { AddItemToQuotationInput } from "../types/item";

// rules
import addItemsToQuotationRules, {
    type AddItemsToQuotationInput as AddItemsToQuotationRulesInput,
} from "../domain/item/addItemsToQuotation.rules";
import { success } from "../utils/handleSuccess";

// repositories
import { createRepositories } from "../repositories/index";

export type AddItemsToQuotationPayload = {
    quotation_version_id: number;
    items: AddItemToQuotationInput[];
};

const addItemsToQuotationService = (db: Database) => (payload: AddItemsToQuotationPayload) => {
    const repo = createRepositories(db);

    // get quotation version
    const quotationVersion = repo.quotation.getByVersion(payload.quotation_version_id);

    // validate rules
    const result = addItemsToQuotationRules({
        quotation_version_id: payload.quotation_version_id,
        items: payload.items,
        quotationVersionExists: quotationVersion,
    });

    // any errors
    if (!result.success) {
        return result;
    }

    const added = repo.item.addToQuotation(
        result.data.quotation_version_id,
        result.data.items
    );

    return success(added);
};

export default addItemsToQuotationService;
