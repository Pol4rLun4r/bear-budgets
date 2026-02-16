import express from "express";
import cors from "cors";

// types
import type { Database } from "better-sqlite3";

// routes
import quotationRoutes from "./routes/quotation.routes";
import clientRoutes from "./routes/client.routes";

export const createApp = (db: Database) => {

    const app = express();
    
    // middleware
    app.use(express.json());
    app.use(cors());

    // using routes
    app.use("/quotations", quotationRoutes(db));
    app.use("/clients", clientRoutes(db));

    return app;
}