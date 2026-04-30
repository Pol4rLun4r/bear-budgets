/* eslint-disable @typescript-eslint/no-explicit-any */
// types
import type { Database } from "better-sqlite3";

export const createQuotationRepository = (db: Database) =>
    ({ client_id, notes, status }: CreateQuotation) => {
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
    (quotation_version_id: number): QuotationVersionSummary | undefined => {
        const quotationVersion = db.prepare(`
            SELECT
                quotations.id as quotation_id,
                quotation_versions.id as quotation_version_id,
                quotations.client_id as client_id,
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
        `).get(quotation_version_id);

        return quotationVersion as QuotationVersionSummary | undefined;
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

export const getAllQuotationsVersionsRepository = (db: Database) =>
    (): QuotationVersion[] | undefined => {
        const quotations = db.prepare(`
        SELECT * FROM quotation_versions
    `).all();

        return quotations as QuotationVersion[] | undefined;
    };

// função que vai pegar todas as cotações feitas, com dados resumidos, dados da cotação, do cliente e valores dos itens
export const getAllQuotationWithSummaryData = (db: Database) =>
    (): QuotationWithSummaryData[] => {
        // busca versões com dados do cliente
        const versions = db.prepare(`
            SELECT
                qv.id as version_id,
                qv.quotation_id,
                qv.version,
                qv.status,
                qv.notes as version_notes,
                qv.created_at as version_created,
                qv.updated_at as version_updated,
                c.id as client_id,
                c.name as client_name,
                c.document as client_document,
                c.type_client as client_type,
                c.notes as client_notes,
                c.created_at as client_created,
                c.updated_at as client_updated
            FROM quotation_versions qv
            JOIN quotations q ON qv.quotation_id = q.id
            JOIN clients c ON q.client_id = c.id
            ORDER BY qv.created_at DESC
        `).all() as any[];

        // para cada versão, busca os itens vinculados
        return versions.map((v) => {
            const items = db.prepare(`
                SELECT 
                    iv.quantity,
                    iv.unit_price,
                    iv.markup,
                    iv.ipi,
                    iv.st,
                    iv.purchase_shipping
                FROM quotation_links ql
                JOIN item_versions iv ON ql.item_version_id = iv.id
                WHERE ql.quotation_version_id = ?
            `).all(v.version_id) as SummaryValues[];

            return {
                client: {
                    id: v.client_id,
                    name: v.client_name,
                    document: v.client_document,
                    type_client: v.client_type,
                    notes: v.client_notes,
                    created_at: v.client_created,
                    updated_at: v.client_updated,
                },
                quotation_version: {
                    id: v.version_id,
                    quotation_id: v.quotation_id,
                    version: v.version,
                    status: v.status,
                    notes: v.version_notes,
                    created_at: v.version_created,
                    updated_at: v.version_updated,
                },
                values: items,
            };
        });
    };