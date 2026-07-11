// database
import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const getAllQuotationsSummary = (db: Database) => () => {
    const repo = createRepositories(db);

    const quotations = repo.quotation.getAllSummary();

    if (quotations === undefined) {
        return failure("Erro interno ao buscar cotações");
    }

    return success(quotations);
}

export default getAllQuotationsSummary;