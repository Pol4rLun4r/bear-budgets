// types
import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

// services
import createQuotationService from "../../services/createQuotation.service";

const create = (db: Database) => (req: Request, res: Response) => {
    const service = createQuotationService(db);
    const result = service(req.body);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(201).json(result);
}

export default create;