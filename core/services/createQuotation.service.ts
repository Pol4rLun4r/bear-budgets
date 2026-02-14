// types
import type { Database } from "better-sqlite3";
import type { createQuotationType } from "../domain/createQuotation.rules"

// rules
import createQuotationRules from "../domain/createQuotation.rules";
import { success } from "../utils/handleSuccess";

// repositories
import { createRepositories } from "../repositories/index";

const createQuotationService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: createQuotationType) => {
        
    });
};
export default createQuotationService;