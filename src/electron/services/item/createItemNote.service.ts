// types
import type { Database } from "better-sqlite3";

// rules
import createItemNoteRules from "../../rules/item/createItemNote.rules.js";
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const createItemNoteService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: ItemNote) => {
        const itemReferenceIdExists = repo.item.getReferenceById(data.item_reference_id)?.id;

        const result = createItemNoteRules({ itemReferenceIdExists, ...data });

        // any errors
        if (!result.success) {
            return result;
        }

        const createItemNote = repo.item.createNote(result.data.notes.item_reference_id, result.data.notes);

        return success(createItemNote);
    });
};

export default createItemNoteService;