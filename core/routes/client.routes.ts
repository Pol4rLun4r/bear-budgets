// express 
import { Router } from "express";

// types
import type { Database } from "better-sqlite3";

// controllers
import search from "../controller/client/searchClients.controller";
import create from "../controller/client/createClient.controller";
import getClient from "../controller/client/getClient.controller";

const clientRoutes = (db: Database) => {
    const router = Router();

    router.post('/', create(db));
    router.post('/search', search(db));
    router.get('/get', getClient(db));

    return router;
}

export default clientRoutes;