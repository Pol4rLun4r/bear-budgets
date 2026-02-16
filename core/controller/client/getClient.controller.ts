// types
import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

// services
import getClientService from "../../domain/getClient.rules";

const getClient = (db: Database) => (req: Request, res: Response) => {
    const service = getClientService(db);
    const client_id = req.body?.client_id;
    const result = service(client_id);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
}

export default getClient;