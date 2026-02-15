import * as Database from "better-sqlite3";
import { createApp } from "../app";
import { runMigrations } from "../db/migrate";

export const createTestApp = () => {
    const db = new Database.default(":memory:");

    db.pragma("foreign_keys = ON");
    runMigrations(db);

    const app = createApp(db);
    return { app, db };
}