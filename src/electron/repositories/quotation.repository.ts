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
                quotations.id AS quotation_id,
                quotation_versions.id AS quotation_version_id,
                quotation_versions.version AS version,
                quotations.client_id AS client_id,
                clients.name AS client_name,
                clients.document AS client_document,
                quotation_versions.status AS status,
                quotation_versions.notes AS notes,
                quotation_versions.amount AS amount,
                quotation_versions.total_value AS total_value,
                datetime(quotations.created_at, 'localtime') AS created_at,
                datetime(quotation_versions.created_at, 'localtime') AS updated_at
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
        /*
          Lista resumida: uma linha por cotação (pai), usando sempre a última revisão
          em quotation_versions (maior version). Novas edições criam nova linha na
          sub-tabela; não há updated_at na versão — created_at da versão = “última mudança”.
        */
        SELECT
            quotations.id AS quotation_id,
            quotation_versions.id AS quotation_version_id,
            quotation_versions.version AS version,
            quotations.client_id AS client_id,
            clients.name AS client_name,
            clients.document AS client_document,
            quotation_versions.status AS status,
            quotation_versions.notes AS notes,
            quotation_versions.amount AS amount,
            quotation_versions.total_value AS total_value,
            /* Quando o pai quotations foi criado (abertura do orçamento). */
            datetime(quotations.created_at, 'localtime') AS created_at,
            /*
              Quando esta linha de quotation_versions foi criada (= nova revisão).
              Alias updated_at para a UI; no schema é created_at da versão atual.
            */
            datetime(quotation_versions.created_at, 'localtime') AS updated_at
        FROM quotations
        /*
          Por quotation_id, pega só o número da última revisão (MAX(version)).
          UNIQUE(quotation_id, version) garante no máximo uma linha por par.
        */
        INNER JOIN (
            SELECT quotation_id, MAX(version) AS latest_version
            FROM quotation_versions
            GROUP BY quotation_id
        ) AS latest_quotation_versions
            ON latest_quotation_versions.quotation_id = quotations.id
        INNER JOIN quotation_versions
            ON quotation_versions.quotation_id = latest_quotation_versions.quotation_id
            AND quotation_versions.version = latest_quotation_versions.latest_version
        INNER JOIN clients
            ON clients.id = quotations.client_id
        /* Ordena pela revisão mais recente no tempo (não pelo id). */
        ORDER BY quotation_versions.created_at DESC
        LIMIT 50
    `).all();

        return quotations as QuotationSummary[] | undefined;
    };