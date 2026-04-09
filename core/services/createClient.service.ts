// types
import type { Database } from "better-sqlite3";
import type { ClientQuery } from "../types/client";

// repositories
import { createRepositories } from "../repositories";

// rules
import createClientRules, { cleanDocument } from "../domain/client/createClient.rules";

// utils
import { success } from "../utils/handleSuccess";

const createClientService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: ClientQuery) => {
        const clientExistsByDocument = repo.client.getByDocument(cleanDocument(data?.document!))

        const result = createClientRules({ clientExistsByDocument, ...data });

        // any errors
        if (!result.success) {
            return result;
        }

        // se o cliente existir baseado no documento
        if (result.code === 'CLIENT_EXISTS_BY_DOCUMENT') {
            return result;
        }

        const createdClient = repo.client.create(result.data);

        return success(createdClient);
    });
};

export default createClientService;