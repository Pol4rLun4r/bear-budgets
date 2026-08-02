import { Database } from "better-sqlite3";

const create = (db: Database) =>
    (quotation_id: QuotationLink['quotation_id'], item_reference_id: QuotationLink['item_reference_id'], item_values_id: QuotationLink['item_values_id']): number => {
        const row = db.prepare(`
            INSERT INTO quotation_links (quotation_id, item_reference_id, item_values_id)
            VALUES (?, ?, ?)
        `).run(quotation_id, item_reference_id, item_values_id);
        return row.lastInsertRowid as number;
    };

const getById = (db: Database) =>
    (quotation_link_id: QuotationLink['id']): QuotationLink | undefined => {
        return db.prepare(`
            SELECT *
            FROM quotation_links
            WHERE id = ?
            LIMIT 1
        `).get(quotation_link_id) as QuotationLink | undefined;
    };

const update = (db: Database) =>
    (id: QuotationLink['id'], data: Partial<QuotationLink>) => {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.item_reference_id !== undefined) {
            fields.push("item_reference_id = ?");
            values.push(data.item_reference_id);
        }

        if (data.item_values_id !== undefined) {
            fields.push("item_values_id = ?");
            values.push(data.item_values_id);
        }

        if (!fields.length) return;

        values.push(id);

        db.prepare(`
            UPDATE quotation_links
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(...values);

        return getById(db)(id);
    }

const quotationLinksRepository = (db: Database) => {
    return {
        create: create(db),
        getById: getById(db),
        update: update(db)
    }
};

export default quotationLinksRepository;