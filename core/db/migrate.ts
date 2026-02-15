import type { Database as DatabaseType } from "better-sqlite3";
import { migrate as runMigrationsFromLib } from "@blackglory/better-sqlite3-migrations";

const INITIAL_UP = `
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        document TEXT NOT NULL,
        notes TEXT,
        type_client TEXT NOT NULL
            DEFAULT 'nacional'
            CHECK (type_client IN ('nacional', 'internacional')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_document ON clients(document);
    CREATE TABLE IF NOT EXISTS quotations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS quotation_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_id INTEGER NOT NULL,
        version INTEGER NOT NULL,
        status INTEGER NOT NULL CHECK (status IN (0, 1, 2)) DEFAULT 0,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        UNIQUE(quotation_id, version)
    );
    CREATE INDEX IF NOT EXISTS idx_quotation_versions_quotation_id ON quotation_versions(quotation_id);
`;

const INITIAL_DOWN = `
    DROP INDEX IF EXISTS idx_quotation_versions_quotation_id;
    DROP TABLE IF EXISTS quotation_versions;
    DROP TABLE IF EXISTS quotations;
    DROP INDEX IF EXISTS idx_clients_document;
    DROP TABLE IF EXISTS clients;
`;

const MIGRATIONS = [
    { version: 1, up: INITIAL_UP, down: INITIAL_DOWN },
];

export function runMigrations(db: DatabaseType): void {
    runMigrationsFromLib(db, MIGRATIONS);
}
