import type { Database } from "better-sqlite3";

/** cria uma nova cotação "a casca do orçamento" */
export const createQuotationRepository = (db: Database) =>
    ({ notes, amount, total_value }: Quotation) => {
        const result = db.transaction(() => {

            // cria a cotação
            const quotation = db.prepare(`
                INSERT INTO quotations (status, notes, total_value, amount)
                VALUES (0, ?, ?, ?)
            `).run(notes, total_value, amount);

            const quotationId = quotation.lastInsertRowid as number;

            // pega os dados da cotação criada
            const quotationData = db.prepare(`
                SELECT * FROM quotations WHERE id = ?
            `).get(quotationId) as Quotation | undefined;

            // retorna a cotação
            return quotationData;
        })

        return result();
    };

/** deleta uma cotação baseada no ID */
export const deleteQuotationRepository = (db: Database) =>
    ({ id }: Pick<Quotation, 'id'>) => {
        return db.prepare(`
        DELETE FROM quotations WHERE id = ?
    `).run(id);

    };

//** pega todas as cotações resumidas */
export const getAllQuotationSummaryRepository = (db: Database) =>
    () => {
        return db.prepare(`
            SELECT * FROM quotations
        `).all() as Quotation[];
    };