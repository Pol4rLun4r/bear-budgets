import type { Database as DatabaseType } from "better-sqlite3";
import { migrate as runMigrationsFromLib } from "@blackglory/better-sqlite3-migrations";

const INITIAL_UP = `
    CREATE TABLE IF NOT EXISTS quotations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status INTEGER NOT NULL CHECK (status IN (0, 1, 2, 3)) DEFAULT 0,
        notes TEXT,
        total_value REAL,
        amount INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS item_references (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        internal_code TEXT,
        manufacturer_code TEXT,
        ncm TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_item_references_description ON item_references(description);

    CREATE TABLE IF NOT EXISTS item_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_reference_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        quantity INTEGER,
        unit_price REAL,
        markup TEXT,
        purchase_shipping REAL,
        ipi REAL,
        st REAL,
        boarding INTEGER,
        extra_value REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reference_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_reference_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_reference_id)
            REFERENCES item_references(id)
            ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_reference_links_item_reference_id
        ON reference_links(item_reference_id);

    CREATE TABLE IF NOT EXISTS quotation_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_id INTEGER NOT NULL,
        item_reference_id INTEGER NOT NULL,
        item_values_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE,
        FOREIGN KEY (item_values_id) REFERENCES item_values(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_quotation_links_quotation_id ON quotation_links(quotation_id);
`;

const INITIAL_DOWN = `
    DROP INDEX IF EXISTS idx_quotation_links_quotation_id;
    DROP TABLE IF EXISTS quotation_links;
    DROP INDEX IF EXISTS idx_reference_links_item_reference_id;
    DROP TABLE IF EXISTS reference_links;
    DROP TABLE IF EXISTS item_values;
    DROP INDEX IF EXISTS idx_item_references_description;
    DROP TABLE IF EXISTS item_references;
    DROP TABLE IF EXISTS quotations;
`;

const SEARCH_UP = `
    DROP INDEX IF EXISTS idx_item_references_description;

    CREATE VIRTUAL TABLE IF NOT EXISTS item_references_search USING fts5(
        description,
        content='item_references',
        content_rowid='id',
        tokenize='unicode61 remove_diacritics 2',
        prefix='2 3 4'
    );

    INSERT INTO item_references_search(rowid, description)
    SELECT id, description
    FROM item_references;

    CREATE TRIGGER IF NOT EXISTS item_references_ai AFTER INSERT ON item_references BEGIN
        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;

    CREATE TRIGGER IF NOT EXISTS item_references_ad AFTER DELETE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);
    END;

    CREATE TRIGGER IF NOT EXISTS item_references_au AFTER UPDATE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);

        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;
`;

const SEARCH_DOWN = `
    DROP TRIGGER IF EXISTS item_references_ai;
    DROP TRIGGER IF EXISTS item_references_ad;
    DROP TRIGGER IF EXISTS item_references_au;

    DROP TABLE IF EXISTS item_references_search;

    CREATE INDEX IF NOT EXISTS idx_item_references_description
    ON item_references(description);
`;

const SEARCH_TOKENIZER_FIX_UP = `
    DROP TRIGGER IF EXISTS item_references_ai;
    DROP TRIGGER IF EXISTS item_references_ad;
    DROP TRIGGER IF EXISTS item_references_au;
    DROP TABLE IF EXISTS item_references_search;

    CREATE VIRTUAL TABLE item_references_search USING fts5(
        description,
        content='item_references',
        content_rowid='id',
        tokenize='unicode61 remove_diacritics 2 tokenchars ''-.,/_''',
        prefix='2 3 4'
    );

    INSERT INTO item_references_search(rowid, description)
    SELECT id, description
    FROM item_references;

    CREATE TRIGGER item_references_ai AFTER INSERT ON item_references BEGIN
        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;

    CREATE TRIGGER item_references_ad AFTER DELETE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);
    END;

    CREATE TRIGGER item_references_au AFTER UPDATE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);

        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;
`;

const SEARCH_TOKENIZER_FIX_DOWN = `
    DROP TRIGGER IF EXISTS item_references_ai;
    DROP TRIGGER IF EXISTS item_references_ad;
    DROP TRIGGER IF EXISTS item_references_au;
    DROP TABLE IF EXISTS item_references_search;

    CREATE VIRTUAL TABLE item_references_search USING fts5(
        description,
        content='item_references',
        content_rowid='id',
        tokenize='unicode61 remove_diacritics 2',
        prefix='2 3 4'
    );

    INSERT INTO item_references_search(rowid, description)
    SELECT id, description
    FROM item_references;

    CREATE TRIGGER item_references_ai AFTER INSERT ON item_references BEGIN
        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;

    CREATE TRIGGER item_references_ad AFTER DELETE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);
    END;

    CREATE TRIGGER item_references_au AFTER UPDATE ON item_references BEGIN
        INSERT INTO item_references_search(item_references_search, rowid, description)
        VALUES ('delete', old.id, old.description);

        INSERT INTO item_references_search(rowid, description)
        VALUES (new.id, new.description);
    END;
`;

const ITEM_VALUES_DELIVERY_UP = `
    ALTER TABLE item_values ADD COLUMN delivery INTEGER;
`;

const ITEM_VALUES_DELIVERY_DOWN = `
    ALTER TABLE item_values DROP COLUMN delivery;
`;

const ITEM_VALUES_TAG_UP = `
    ALTER TABLE item_values
    ADD COLUMN tag INTEGER NOT NULL DEFAULT 0 CHECK (tag IN (0, 1, 2, 3));
`;

const ITEM_VALUES_TAG_DOWN = `
    ALTER TABLE item_values DROP COLUMN tag;
`;

const rebuildQuotationStatusConstraint = (
    db: DatabaseType,
    statusConstraint: "0, 1" | "0, 1, 2, 3",
    statusExpression: string,
) => {
    const previousSequence = db.prepare(
        "SELECT seq FROM sqlite_sequence WHERE name = 'quotations'",
    ).get() as { seq: number } | undefined;

    db.exec(`
        CREATE TABLE quotations_status_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            status INTEGER NOT NULL CHECK (status IN (${statusConstraint})) DEFAULT 0,
            notes TEXT,
            total_value REAL,
            amount INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO quotations_status_new (
            id, status, notes, total_value, amount, created_at, updated_at
        )
        SELECT
            id, ${statusExpression}, notes, total_value, amount, created_at, updated_at
        FROM quotations;

        CREATE TABLE quotation_links_status_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quotation_id INTEGER NOT NULL,
            item_reference_id INTEGER NOT NULL,
            item_values_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (quotation_id) REFERENCES quotations_status_new(id) ON DELETE CASCADE,
            FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE,
            FOREIGN KEY (item_values_id) REFERENCES item_values(id) ON DELETE CASCADE
        );

        INSERT INTO quotation_links_status_new (
            id, quotation_id, item_reference_id, item_values_id, created_at, updated_at
        )
        SELECT id, quotation_id, item_reference_id, item_values_id, created_at, updated_at
        FROM quotation_links;

        DROP TABLE quotation_links;
        DROP TABLE quotations;

        ALTER TABLE quotations_status_new RENAME TO quotations;
        ALTER TABLE quotation_links_status_new RENAME TO quotation_links;

        CREATE INDEX idx_quotation_links_quotation_id ON quotation_links(quotation_id);
    `);

    if (previousSequence) {
        const updateSequence = db.prepare(`
            UPDATE sqlite_sequence
            SET seq = MAX(seq, ?)
            WHERE name = 'quotations'
        `);

        if (updateSequence.run(previousSequence.seq).changes === 0) {
            db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES ('quotations', ?)").run(previousSequence.seq);
        }
    }
};

const QUOTATION_STATUS_UP = (db: DatabaseType) => {
    rebuildQuotationStatusConstraint(db, "0, 1, 2, 3", "status");
};

const QUOTATION_STATUS_DOWN = (db: DatabaseType) => {
    rebuildQuotationStatusConstraint(db, "0, 1", "CASE WHEN status = 0 THEN 0 ELSE 1 END");
};

const MIGRATIONS = [
    { version: 1, up: INITIAL_UP, down: INITIAL_DOWN },
    { version: 2, up: SEARCH_UP, down: SEARCH_DOWN },
    { version: 3, up: SEARCH_TOKENIZER_FIX_UP, down: SEARCH_TOKENIZER_FIX_DOWN },
    { version: 4, up: ITEM_VALUES_DELIVERY_UP, down: ITEM_VALUES_DELIVERY_DOWN },
    { version: 5, up: ITEM_VALUES_TAG_UP, down: ITEM_VALUES_TAG_DOWN },
    { version: 6, up: QUOTATION_STATUS_UP, down: QUOTATION_STATUS_DOWN },
];

export function runMigrations(db: DatabaseType): void {
    runMigrationsFromLib(db, MIGRATIONS);
}
