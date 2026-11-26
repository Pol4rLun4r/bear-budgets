import type { Database } from "better-sqlite3";

const quotationSummaryQuery = `
    SELECT
        id,
        status,
        notes,
        total_value,
        amount,
        datetime(created_at, 'localtime') AS created_at,
        datetime(updated_at, 'localtime') AS updated_at
    FROM quotations
`;

/** cria uma nova cotação "a casca do orçamento" */
const create = (db: Database) =>
    ({ notes, status, amount, total_value }: Quotation) => {
        const result = db.transaction(() => {

            // cria a cotação
            const quotation = db.prepare(`
                INSERT INTO quotations (status, notes, total_value, amount)
                VALUES (?, ?, ?, ?)
            `).run(status ?? 0, notes, total_value, amount);

            const quotationId = quotation.lastInsertRowid as number;

            // pega os dados da cotação criada
            const quotationData = db.prepare(`
                SELECT
                    id,
                    status,
                    notes,
                    total_value,
                    amount,
                    datetime(created_at, 'localtime') AS created_at,
                    datetime(updated_at, 'localtime') AS updated_at
                FROM quotations
                WHERE id = ?
            `).get(quotationId) as Quotation | undefined;

            // retorna a cotação
            return quotationData;
        })

        return result();
    };

/** deleta uma cotação baseada no ID */
const deleteById = (db: Database) =>
    ({ id }: Pick<Quotation, 'id'>) => {
        return db.prepare(`
        DELETE FROM quotations WHERE id = ?
    `).run(id);

    };

/** pega todas as cotações resumidas */
const getAllSummary = (db: Database) =>
    () => {
        return db.prepare(`
            ${quotationSummaryQuery}
            ORDER BY created_at DESC, id DESC
            LIMIT 50
        `).all() as Quotation[];
    };

/** pesquisa o resumo das cotações pelo ID exibido ou pelas anotações */
const searchSummary = (db: Database) =>
    (query: string) => {
        return db.prepare(`
            ${quotationSummaryQuery}
            WHERE
                instr(CAST(id AS TEXT), ?) > 0
                OR instr(printf('%06d', id), ?) > 0
                OR instr(LOWER(COALESCE(notes, '')), LOWER(?)) > 0
            ORDER BY created_at DESC, id DESC
        `).all(query, query, query) as Quotation[];
    };

/** pega a cotação pelo id */
const getById = (db: Database) =>
    (quotation_id: Quotation['id']) => {
        return db.prepare(`
        SELECT
            id,
            status,
            notes,
            total_value,
            amount,
            datetime(created_at, 'localtime') AS created_at,
            datetime(updated_at, 'localtime') AS updated_at
        FROM quotations
        WHERE id = ?
        LIMIT 1
    `).get(quotation_id) as Quotation | undefined;
};

/** atualiza uma cotação baseada no ID */
const update = (db: Database) =>
    ({ id, notes, amount, total_value, status }: Partial<Quotation> & Pick<Quotation, 'id'>) => {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (notes !== undefined) {
            fields.push("notes = ?");
            values.push(notes);
        }

        if (amount !== undefined) {
            fields.push("amount = ?");
            values.push(amount);
        }

        if (total_value !== undefined) {
            fields.push("total_value = ?");
            values.push(total_value);
        }

        if (status !== undefined) {
            fields.push("status = ?");
            values.push(status);
        }

        if (!fields.length) {
            return db.prepare(`
                UPDATE quotations
                SET updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(id);
        }

        values.push(id);

        db.prepare(`
            UPDATE quotations
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(...values);

        return getById(db)(id);
    };

const quotationRepository = (db: Database) => {
    return {
        create: create(db),
        getById: getById(db),
        deleteById: deleteById(db),
        getAllSummary: getAllSummary(db),
        searchSummary: searchSummary(db),
        update: update(db)
    };
};
export default quotationRepository;