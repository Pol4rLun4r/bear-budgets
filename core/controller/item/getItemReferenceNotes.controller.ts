// types
import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

// services
import getItemReferenceNotesService from "../../services/getItemReferenceNotes.service";

const getItemReferenceNotes = (db: Database) => (req: Request, res: Response) => {
    const service = getItemReferenceNotesService(db);
    const item_reference_id = Number(req.query?.item_reference_id);
    const result = service(item_reference_id);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
};

export default getItemReferenceNotes;
