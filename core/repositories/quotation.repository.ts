// types
import type { Database } from "better-sqlite3";
import type { QuotationStatus, QuotationType, QuotationQuery } from "../../types/quotation"; 

export type QuotationVersionSummary = {
    quotation_id: number;
    quotation_version_id: number;
    client_name: string;
    client_document: string;
    version: number;
    status: QuotationStatus;
    notes: string | null;
};



export const createQuotationRepository = (db: Database) => ({ client_id, notes, status }: QuotationQuery) => {
    const quotation = db.transaction(() => {

        // cria a cotação
        const quotationRow = db.prepare(`
            INSERT INTO quotations (client_id)
            VALUES (?)
        `).run(client_id);

        const quotationId = quotationRow.lastInsertRowid as number;

        // cria a primeira versão da cotação
        const quotationVersion = db.prepare(`
            INSERT INTO quotation_versions (quotation_id, version, status, notes)
            VALUES (?, 1, ?, ?)
        `).run(quotationId, status, notes);

        const quotationVersionId = quotationVersion.lastInsertRowid as number;

        return quotationVersionId
    })

    return quotation();
};

export const getQuotationVersionByIdRepository = (db: Database) =>
    (id: number): QuotationVersionSummary | undefined => {
        const row = db.prepare(`
            SELECT
                quotations.id as quotation_id,
                quotation_versions.id as quotation_version_id,
                clients.name as client_name,
                clients.document as client_document,
                quotation_versions.version,
                quotation_versions.status,
                quotation_versions.notes
            FROM quotation_versions
            JOIN quotations ON quotation_versions.quotation_id = quotations.id
            JOIN clients ON quotations.client_id = clients.id
            WHERE quotation_versions.id = ?
            LIMIT 1
        `).get(id) as QuotationVersionSummary | undefined;

        return row;
    };

export const getQuotationByIdRepository = (db: Database) => (id: number) => {
    // get quotation by id
    const quotation = db.prepare(`
        SELECT * FROM quotations WHERE id = ? LIMIT 1
    `).get(id);

    return quotation as QuotationType | undefined;
};

export const getAllQuotationsRepository = (db: Database) => () => {
    // get all quotations
    const quotations = db.prepare(`
        SELECT * FROM quotations
    `).all();

    return quotations as QuotationType[] | undefined;
};

export const getAllQuotationsVersionsRepository = (db: Database) => () => {
    // get all quotations
    const quotations = db.prepare(`
        SELECT * FROM quotation_versions
    `).all();

    return quotations as QuotationType[] | undefined;
};