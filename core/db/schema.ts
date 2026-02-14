// database
import type { Database as DatabaseType } from "better-sqlite3";

export type ClientCategory = "nacional" | "internacional";

export type ClientType = {
    id: number;
    name?: string;
    document?: string;
    type_client?: ClientCategory;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

// Cotação "container" – agrupa todas as versões. Imutável (não se edita, só se adicionam versões).
export type QuotationType = {
    id: number;
    client_id: number;
    created_at: string;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
export type QuotationStatus = 0 | 1 | 2;

// Uma versão imutável de uma cotação. "Editar" = criar nova versão. 
export type QuotationVersionType = {
    id: number;
    quotation_id: number;
    version: number;
    status: QuotationStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export const ApplySchema = (db: DatabaseType) => {
    db.prepare(`
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
    `).run();


    db.prepare(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_document
        ON clients(document);
    `).run();

    // Cotação = container imutável. Uma cotação agrupa N versões.
    db.prepare(`
        CREATE TABLE IF NOT EXISTS quotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );
    `).run();

    // Cada "edição" vira uma nova linha aqui. Versão 1 = criação; 2, 3... = edições.
    db.prepare(`
        CREATE TABLE IF NOT EXISTS quotation_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quotation_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            status INTEGER NOT NULL
                CHECK (status IN (0, 1, 2))
                DEFAULT 0,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
            UNIQUE(quotation_id, version)
        );
    `).run();

    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_quotation_versions_quotation_id
        ON quotation_versions(quotation_id);
    `).run();
};

// status: 0 = draft, 1 = approved, 2 = omie