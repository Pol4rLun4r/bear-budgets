// types
import type { Database } from "better-sqlite3";
import type { QuotationQuery } from "../types/quotation";

// rules
import createQuotationRules from "../domain/quotation/createQuotation.rules";
import { success } from "../utils/handleSuccess";

// repositories
import { createRepositories } from "../repositories/index";

const createQuotationService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: QuotationQuery) => {
        const clientExists = repo.client.getById(data?.client_id);

        const result = createQuotationRules({clientExists, ...data});

        // any errors
        if(!result.success) {
            return result;
        }

        const createQuotation = repo.quotation.create(result.data);

        const quotation = repo.quotation.getByVersion(createQuotation);

        return success(quotation);
    });
};

export default createQuotationService;