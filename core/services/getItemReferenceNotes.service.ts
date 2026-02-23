// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../repositories";

// rules
import getItemReferenceNotesRules from "../domain/item/getItemReferenceNotes.rules";

// utils
import { success } from "../utils/handleSuccess";

const getItemReferenceNotesService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((item_reference_id: number) => {
        const result = getItemReferenceNotesRules({ item_reference_id });

        if (!result.success) {
            return result;
        }

        const notes = repo.item.getReferenceNotesByReferenceId(result.data);
        return success(notes);
    });
};

export default getItemReferenceNotesService;
