// services
import searchItemReferencesService from "../../services/searchItemReferences.service";

// types
import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

const searchItemsReferences = (db: Database) => (req: Request, res: Response) => {
    const service = searchItemReferencesService(db);
    const result = service(req.body.query);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
}

export default searchItemsReferences;