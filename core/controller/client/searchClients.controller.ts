// types
import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

// services
import searchClientsService from "../../services/searchClients.service";

const search = (db: Database) => (req: Request, res: Response) => {
    const service = searchClientsService(db);
    const result = service(req.body);

    if(!result.success) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
}

export default search;