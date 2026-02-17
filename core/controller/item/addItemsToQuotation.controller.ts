import type { Request, Response } from "express";
import type { Database } from "better-sqlite3";

import addItemsToQuotationService from "../../services/addItemsToQuotation.service";

const addItems = (db: Database) => (req: Request, res: Response) => {
    const service = addItemsToQuotationService(db);
    const result = service(req.body);

    if (!result.success) {
        return res.status(400).json(result);
    }

    return res.status(201).json(result);
};

export default addItems;
