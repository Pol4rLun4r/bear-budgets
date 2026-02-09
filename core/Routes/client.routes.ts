// express 
import { Router } from "express";

// types
import type { Database } from "better-sqlite3";

// controllers
import search from "../controller/searchClients.controller";

const clientRoutes = (db: Database) => {
    const router = Router();

    router.post('/search', search(db));

    return router;
}

export default clientRoutes;