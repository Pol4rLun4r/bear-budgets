// types
import type {Request, Response} from "express";
import { Database } from "better-sqlite3";

// services
import createClientService from "../../services/createClient.service";

const create = (db: Database) => (req: Request, res: Response) => {
    const service = createClientService(db);
    const result = service(req.body);

    if(!result.success) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
};

export default create;