// types
import type { Database } from "better-sqlite3";

export const createQuotationRepository = (db: Database) =>
    ({ client_id, notes, status, amount, total_value }: CreateQuotation) => {
        const quotation = db.transaction(() => {

            // cria a cotação
            const quotationRow = db.prepare(`
            INSERT INTO quotations (client_id)
            VALUES (?)
        `).run(client_id);

            const quotationId = quotationRow.lastInsertRowid as number;

            // cria a primeira versão da cotação
            const quotationVersion = db.prepare(`
            INSERT INTO quotation_versions (quotation_id, version, status, notes, total_value, amount)
            VALUES (?, 1, ?, ?, ?, ?)
        `).run(quotationId, status, notes, total_value, amount);

            const quotationVersionId = quotationVersion.lastInsertRowid as number;

            return quotationVersionId
        })

        return quotation();
    };

export const getQuotationVersionByIdRepository = (db: Database) =>
    (quotation_version_id: number): QuotationSummary | undefined => {
        const quotationVersion = db.prepare(`
            SELECT
                quotations.id as quotation_id,
                quotation_versions.id as quotation_version_id,
                quotations.client_id as client_id,
                clients.name as client_name,
                clients.document as client_document,
                quotation_versions.version,
                quotation_versions.status,
                quotation_versions.notes,
                quotation_versions.amount,
                quotation_versions.total_value
            FROM quotation_versions
            JOIN quotations ON quotation_versions.quotation_id = quotations.id
            JOIN clients ON quotations.client_id = clients.id
            WHERE quotation_versions.id = ?
            LIMIT 1
        `).get(quotation_version_id);

        return quotationVersion as QuotationSummary | undefined;
    };

export const getQuotationByIdRepository = (db: Database) =>
    (quotation_id: number): Quotation | undefined => {
        const quotation = db.prepare(`
        SELECT * FROM quotations WHERE id = ? LIMIT 1
    `).get(quotation_id);

        return quotation as Quotation | undefined;
    };

export const getAllQuotationsRepository = (db: Database) =>
    (): Quotation[] | undefined => {
        const quotations = db.prepare(`
        SELECT * FROM quotations
    `).all();

        return quotations as Quotation[] | undefined;
    };

export const getAllQuotationsSummaryRepository = (db: Database) =>
    (): QuotationSummary[] | undefined => {
        const quotations = db.prepare(`
        SELECT
            quotations.id as quotation_id,
            quotation_versions.id as quotation_version_id,
            quotations.client_id as client_id,
            clients.name as client_name,
            clients.document as client_document,
            quotation_versions.version,
            quotation_versions.status,
            quotation_versions.notes,
            quotation_versions.amount,
            quotation_versions.total_value
        FROM quotations
        JOIN (
            SELECT quotation_id, MAX(version) AS latest_version
            FROM quotation_versions
            GROUP BY quotation_id
        ) latest_quotation_versions ON latest_quotation_versions.quotation_id = quotations.id
        JOIN quotation_versions
            ON quotation_versions.quotation_id = latest_quotation_versions.quotation_id
            AND quotation_versions.version = latest_quotation_versions.latest_version
        JOIN clients ON quotations.client_id = clients.id
        ORDER BY quotation_versions.id DESC
        LIMIT 50
    `).all();

        return quotations as QuotationSummary[] | undefined;
    };