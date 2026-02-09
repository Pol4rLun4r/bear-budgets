import express from "express";

// types
import type { Database } from "better-sqlite3";

// routes
import quotationRoutes from "./Routes/quotation.routes";
import clientRoutes from "./Routes/client.routes";


export const createApp = (db: Database) => {
    const app = express();
    
    // middleware
    app.use(express.json());

    // using routes
    app.use("/quotations", quotationRoutes(db));
    app.use("/clients", clientRoutes(db));

    return app;
}