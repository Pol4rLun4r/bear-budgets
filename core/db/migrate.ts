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

    CREATE TABLE IF NOT EXISTS item_references (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        internal_code TEXT,
        manufacturer_code TEXT,
        ncm TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_item_references_description ON item_references(description);

    CREATE TABLE IF NOT EXISTS item_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_reference_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('text', 'link')),
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_reference_id)
            REFERENCES item_references(id)
            ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS item_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_reference_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        version INTEGER NOT NULL,
        quantity REAL NOT NULL DEFAULT 1,
        unit_price REAL,
        markup REAL,
        purchase_freight REAL,
        ipi REAL,
        st REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE,
        UNIQUE(item_reference_id, version)
    );
    CREATE INDEX IF NOT EXISTS idx_item_versions_item_reference_id ON item_versions(item_reference_id);

    CREATE TABLE IF NOT EXISTS quotation_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_version_id INTEGER NOT NULL,
        item_reference_id INTEGER NOT NULL,
        item_version_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quotation_version_id) REFERENCES quotation_versions(id) ON DELETE CASCADE,
        FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE,
        FOREIGN KEY (item_version_id) REFERENCES item_versions(id) ON DELETE CASCADE,
        UNIQUE(quotation_version_id, item_version_id)
    );
    CREATE INDEX IF NOT EXISTS idx_quotation_links_quotation_version_id ON quotation_links(quotation_version_id);
`;

const INITIAL_DOWN = `
    DROP INDEX IF EXISTS idx_quotation_links_quotation_version_id;
    DROP TABLE IF EXISTS quotation_links;
    DROP INDEX IF EXISTS idx_item_versions_item_reference_id;
    DROP TABLE IF EXISTS item_versions;
    DROP TABLE IF EXISTS item_notes;
    DROP INDEX IF EXISTS idx_item_references_description;
    DROP TABLE IF EXISTS item_references;
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
