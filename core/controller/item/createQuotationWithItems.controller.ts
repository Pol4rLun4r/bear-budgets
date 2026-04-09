import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

import createQuotationWithItems from "../../services/createQuotationWithItems.service";

const createQuotationAndItems = (db: Database) => (req: Request, res: Response) => {
    const service = createQuotationWithItems(db);
    const result = service(req.body);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(201).json(result);
};

export default createQuotationAndItems;
