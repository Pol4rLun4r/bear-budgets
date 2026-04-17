import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";

// types
import type { Database } from "better-sqlite3";

// routes
import quotationRoutes from "./routes/quotation.routes";
import clientRoutes from "./routes/client.routes";

// utils
import { failure } from "./utils/handleSuccess";

export const createApp = (db: Database) => {

    const app = express();
    
    // middleware
    app.use(express.json());
    app.use(cors());

    // using routes
    app.use("/quotations", quotationRoutes(db));
    app.use("/clients", clientRoutes(db));

    // centralized error handler
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        console.error("Unhandled error:", err);

        const message = err instanceof Error ? err.message : String(err);

        return res.status(500).json(failure(message));
    });

    return app;
}