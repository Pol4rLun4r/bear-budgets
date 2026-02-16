// express
import { Router } from "express";

// types
import type { Database } from "better-sqlite3";

// controllers
import create from "../controller/quotation/createQuotation.controller";

const quotationRoutes = (db: Database) => {
    const router = Router();

    router.post("/", create(db));

    return router;
}

export default quotationRoutes;