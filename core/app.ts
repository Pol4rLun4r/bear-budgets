import express from "express";
import cors from "cors";

// types
import type { Database } from "better-sqlite3";

// routes
import quotationRoutes from "./Routes/quotation.routes";
import clientRoutes from "./Routes/client.routes";

// teste ruim
import { fakeClients } from './tests/client/fakeClients';
import { createRepositories } from "./repositories";

export const createApp = (db: Database) => {
    // test ruim
    fakeClients.map(client => {
        createRepositories(db).client.create(client);
    })

    const app = express();
    
    // middleware
    app.use(express.json());
    app.use(cors());

    // using routes
    app.use("/quotations", quotationRoutes(db));
    app.use("/clients", clientRoutes(db));

    return app;
}