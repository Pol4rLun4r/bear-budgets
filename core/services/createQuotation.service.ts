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
        // Check if client exists
        const clientIdExists = repo.client.getById(data.client_id)?.id;
        const clientExists = repo.client.getByDocument(data.document)?.id;

        // Apply rules
        const rulesResult = createQuotationRules({ ...data, clientIdExists, clientExists });

        // Check rules result
        if (!rulesResult.success) {
            return rulesResult as Omit<typeof rulesResult, "code"> // failure
        }

        if (rulesResult.code === "CLIENT_EXISTS") {
            const { client_id, status } = rulesResult.data;
            const quotation = repo.quotation.create({
                ...data,
                client_id,
                status
            });
            
            return success(quotation);
        }

        const { name, document, type_client, status, notes } = rulesResult.data;
        
        const newClientId = repo.client.create({ name, document, type_client, notes });
        const quotation = repo.quotation.create({ client_id: newClientId as number, status: status });

        return success(quotation) as Omit<typeof rulesResult, "code">;
    });
};
export default createQuotationService;