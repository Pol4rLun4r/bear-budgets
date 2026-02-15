// types
import type { Database } from "better-sqlite3";
import type { ClientQuery } from "../repositories/client.repository";

// repositories
import { createRepositories } from "../repositories";

// rules
import createClientRules, { cleanDocument } from "../domain/createClient.rules";

// utils
import { success } from "../utils/handleSuccess";

const createClientService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: ClientQuery) => {
        const clientExists = repo.client.getByDocument(cleanDocument(data?.document!))

        const result = createClientRules({clientExists, ...data});

        // any errors
        if(!result.success) {
            return result;
        }

        // if client exists
        if(result.code === 'CLIENT_EXISTS') {
            return result;
        }

        const createdClient = repo.client.create(result.data);
        
        return success(createdClient);
    });
};

export default createClientService;
