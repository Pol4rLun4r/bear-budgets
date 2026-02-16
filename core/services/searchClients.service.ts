// types
import type { Database } from "better-sqlite3";
import type { SearchClientDataType } from "../domain/client/searchClients.rules";

// repositories
import { createRepositories } from "../repositories";

// utils
import { success } from "../utils/handleSuccess";

// rules
import searchClientsRules from "../domain/client/searchClients.rules";

const searchClientsService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: SearchClientDataType) => {
        const result = searchClientsRules(data);

        // any errors
        if (!result.success) {
            return result;
        }

        // if 'type' is 'document'
        if (result.code === 'DOCUMENT') {
            const value = result.data;
            return success(repo.client.searchByDocument(value))
        }

        // if 'type' is 'name'
        const value = result.data;
        return success(repo.client.searchByName(value));
    })
};

export default searchClientsService;