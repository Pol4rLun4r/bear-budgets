// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../repositories";

// utils
import { onlyNumbers, onlyName } from '../utils/clean';
import { success } from "../utils/handleSuccess";

// rules
import searchClientsRules from "../domain/searchClients.rules";

export type SearchClientDataType = {
    value: string;
    type: 'document' | 'name'
}

const searchClientsService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction(({ type, value }: SearchClientDataType) => {
        // check what type of search you should do
        const query = () => {
            if (type === 'document') {
                return repo.client.searchByDocument(onlyNumbers(value));
            }

            return repo.client.searchByName(onlyName(value));
        }

        const queryClients = query();

        const clients = (searchClientsRules(queryClients));

        if (!clients.success) {
            return clients;
        }
        
        return success(clients.data);
    })

}

export default searchClientsService;