// database
import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** pegar resumo de todas as cotações (dados base) */
const getAllQuotationsSummary = (db: Database) => (rawQuery?: unknown) => {
    const repo = createRepositories(db);

    if (rawQuery !== undefined && typeof rawQuery !== "string") {
        return failure("A pesquisa deve ser um texto válido", "INVALID_SEARCH_QUERY");
    }

    const query = rawQuery?.trim();
    const quotations = query
        ? repo.quotation.base.searchSummary(query)
        : repo.quotation.base.getAllSummary();

    if (quotations === undefined) {
        return failure("Erro interno ao buscar cotações");
    }

    return success(quotations);
}

export default getAllQuotationsSummary;