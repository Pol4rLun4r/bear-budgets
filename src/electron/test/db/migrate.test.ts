/// <reference types="vitest/globals" />

import Database from "better-sqlite3";
import { runMigrations } from "../../db/migrate.js";

describe("runMigrations", () => {
    it("preserva o banco legado e não mexe em boarding", () => {
        const db = new Database(":memory:");
        db.pragma("foreign_keys = ON");

        db.exec(`
            CREATE TABLE item_references (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE item_values (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_reference_id INTEGER NOT NULL,
                position INTEGER NOT NULL,
                quantity INTEGER,
                unit_price REAL,
                markup TEXT,
                purchase_shipping REAL,
                ipi REAL,
                st REAL,
                boarding TEXT,
                extra_value REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE
            );
        `);

        db.exec(`
            INSERT INTO item_references (description) VALUES ('Ref 1'), ('Ref 2');

            INSERT INTO item_values (
                item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, boarding, extra_value, created_at, updated_at
            ) VALUES
                (1, 1, 1, 10.0, NULL, NULL, NULL, NULL, '3 dias úteis', NULL, '2024-01-01', '2024-01-01'),
                (2, 1, 1, 12.0, NULL, NULL, NULL, NULL, '7', NULL, '2024-01-01', '2024-01-01'),
                (2, 2, 1, 15.0, NULL, NULL, NULL, NULL, 12, NULL, '2024-01-01', '2024-01-01');
        `);

        runMigrations(db);

        const boardingColumn = db.prepare("PRAGMA table_info(item_values)").all() as Array<{ name: string; type: string }>;
        const rows = db.prepare("SELECT id, boarding FROM item_values ORDER BY id").all() as Array<{ id: number; boarding: string | number | null }>;

        expect(boardingColumn.find((column) => column.name === "boarding")?.type).toBe("TEXT");
        expect(boardingColumn.find((column) => column.name === "delivery")?.type).toBe("INTEGER");
        expect(rows).toEqual([
            { id: 1, boarding: "3 dias úteis" },
            { id: 2, boarding: "7" },
            { id: 3, boarding: "12" },
        ]);

        const deliveryRows = db.prepare("SELECT id, delivery FROM item_values ORDER BY id").all() as Array<{ id: number; delivery: number | null }>;
        expect(deliveryRows).toEqual([
            { id: 1, delivery: null },
            { id: 2, delivery: null },
            { id: 3, delivery: null },
        ]);

        const tagRows = db.prepare("SELECT id, tag FROM item_values ORDER BY id").all() as Array<{ id: number; tag: number }>;
        expect(tagRows).toEqual([
            { id: 1, tag: 0 },
            { id: 2, tag: 0 },
            { id: 3, tag: 0 },
        ]);
        expect(() => db.prepare("UPDATE item_values SET tag = 4 WHERE id = 1").run()).toThrow();
        expect(() => db.prepare("UPDATE item_values SET tag = NULL WHERE id = 1").run()).toThrow();
        const discountColumns = db.prepare("PRAGMA table_info(item_values)").all() as Array<{ name: string; dflt_value: string | null }>;
        expect(discountColumns.find((column) => column.name === "discount_value")).toMatchObject({
            name: "discount_value",
        });
        expect(discountColumns.find((column) => column.name === "discount_type")).toMatchObject({
            name: "discount_type",
            dflt_value: "'fixed'",
        });
        expect(db.prepare("SELECT discount_value, discount_type FROM item_values WHERE id = 1").get()).toEqual({
            discount_value: null,
            discount_type: "fixed",
        });
        expect(() => db.prepare("UPDATE item_values SET discount_type = 'cash' WHERE id = 1").run()).toThrow();
        expect(() => db.prepare("UPDATE item_values SET discount_value = -1 WHERE id = 1").run()).toThrow();

        db.close();
    });

    it("cria item_values com delivery, tag e desconto em banco novo", () => {
        const db = new Database(":memory:");
        db.pragma("foreign_keys = ON");

        runMigrations(db);

        const columns = db.prepare("PRAGMA table_info(item_values)").all() as Array<{
            name: string;
            type: string;
            notnull: number;
            dflt_value: string | null;
        }>;
        expect(columns.find((column) => column.name === "delivery")?.type).toBe("INTEGER");
        expect(columns.find((column) => column.name === "tag")).toMatchObject({
            type: "INTEGER",
            notnull: 1,
            dflt_value: "0",
        });
        expect(columns.find((column) => column.name === "discount_value")?.type).toBe("REAL");
        expect(columns.find((column) => column.name === "discount_type")).toMatchObject({
            type: "TEXT",
            notnull: 1,
            dflt_value: "'fixed'",
        });

        db.close();
    });

    it("amplia os status das cotações sem perder vínculos ou a sequência de IDs", () => {
        const db = new Database(":memory:");
        db.pragma("foreign_keys = ON");

        db.exec(`
            CREATE TABLE quotations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                status INTEGER NOT NULL CHECK (status IN (0, 1)) DEFAULT 0,
                notes TEXT,
                total_value REAL,
                amount INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE item_references (id INTEGER PRIMARY KEY);
            CREATE TABLE item_values (
                id INTEGER PRIMARY KEY,
                item_reference_id INTEGER NOT NULL REFERENCES item_references(id)
            );
            CREATE TABLE quotation_links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
                item_reference_id INTEGER NOT NULL REFERENCES item_references(id) ON DELETE CASCADE,
                item_values_id INTEGER NOT NULL REFERENCES item_values(id) ON DELETE CASCADE,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX idx_quotation_links_quotation_id ON quotation_links(quotation_id);

            INSERT INTO quotations (id, status, notes, total_value, amount)
            VALUES (17, 0, 'rascunho existente', 25.5, 1), (18, 0, NULL, 0, 1);
            INSERT INTO item_references (id) VALUES (4);
            INSERT INTO item_values (id, item_reference_id) VALUES (9, 4);
            INSERT INTO quotation_links (id, quotation_id, item_reference_id, item_values_id)
            VALUES (7, 17, 4, 9);
            DELETE FROM quotations WHERE id = 18;
            PRAGMA user_version = 5;
        `);

        runMigrations(db);

        const quotation = db.prepare(`
            SELECT id, status, notes, total_value, amount
            FROM quotations
            WHERE id = 17
        `).get();
        expect(quotation).toMatchObject({
            id: 17,
            status: 0,
            notes: "rascunho existente",
            total_value: 25.5,
            amount: 1,
        });
        expect(db.prepare("SELECT id, quotation_id FROM quotation_links").all()).toEqual([
            { id: 7, quotation_id: 17 },
        ]);
        expect(db.pragma("foreign_key_check")).toEqual([]);

        db.prepare("UPDATE quotations SET status = ? WHERE id = 17").run(2);
        db.prepare("UPDATE quotations SET status = ? WHERE id = 17").run(3);
        expect(() => db.prepare("UPDATE quotations SET status = 4 WHERE id = 17").run()).toThrow();

        const nextQuotation = db.prepare(`
            INSERT INTO quotations (status, total_value, amount)
            VALUES (0, 0, 1)
        `).run();
        expect(nextQuotation.lastInsertRowid).toBe(19);

        db.close();
    });
});
