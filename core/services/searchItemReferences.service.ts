// utils
import { success } from "../utils/handleSuccess";

// repositories
import { createRepositories } from "../repositories";

// types
import { Database } from "better-sqlite3";

// rules
import searchItemReferencesRules from "../domain/item/searchItemReferences.rules";

const searchItemReferencesService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((rawQuery: string) => {
        const result = searchItemReferencesRules(rawQuery);

        // any errors
        if (!result.success) {
            return result;
        }

        return success(repo.item.searchByDescription(result.data));
    });
}

export default searchItemReferencesService;