// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import getItemNotesRules from "../../rules/item/getItemNotes.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const getItemNotesService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((item_reference_id: ItemNote['item_reference_id']) => {
        const result = getItemNotesRules(item_reference_id);

        if (!result.success) {
            return result;
        }

        const notes = repo.item.getReferenceNotesByReferenceId(result.data);
        return success(notes);
    });
};

export default getItemNotesService;