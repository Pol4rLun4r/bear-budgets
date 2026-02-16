// types
import type { Database } from "better-sqlite3";

// repositores
import { createRepositories } from "../repositories";

// rules
import getClientRules from "../services/getClient.service";

// utils
import { success } from "../utils/handleSuccess";

const getClientService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((client_id: number) => {
        const clientExists = repo.client.getById((client_id));

        const result = getClientRules({ clientExists, client_id });

        // any errors
        if(!result.success) {
            return result;
        }

        return success(clientExists);
    });
}

export default getClientService;