import { Database } from "better-sqlite3";

/**  busca item_values pelo id */
export const getById = (db: Database) =>
    (item_values_id: number): ItemValues | undefined => {
        const itemValues = db.prepare(`
            SELECT * FROM item_values WHERE id = ? LIMIT 1
        `).get(item_values_id) as ItemValues | undefined;

        return itemValues;
    };

/**  busca todos os values do item pelo id */
export const getAllIByReferenceId = (db: Database) =>
    (item_reference_id: number): ItemValues[] => {
        const values = db.prepare(`
            SELECT *
            FROM item_values
            WHERE item_reference_id = ?
            ORDER BY created_at ASC
            LIMIT 15
        `).all(item_reference_id) as ItemValues[];

        return values;
    };


/** cria um item_value */
export const create = (db: Database) =>
    (item_reference_id: number, data: Omit<ItemValues, "id" | "created_at">): number => {
        const row = db.prepare(`
            INSERT INTO item_values (item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, extra_value, boarding)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            item_reference_id,
            data.position,
            data.quantity ?? 1,
            data.unit_price ?? undefined,
            data.markup ?? undefined,
            data.purchase_shipping ?? undefined,
            data.ipi ?? undefined,
            data.st ?? undefined,
            data.extra_value ?? undefined,
            data.boarding ?? undefined
        );
        return row.lastInsertRowid as number;
    };

const update = (db: Database) => (id: ItemValues['id'], data: Partial<ItemValues>) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.position !== undefined) {
        fields.push("position = ?");
        values.push(data.position);
    }

    if (data.quantity !== undefined) {
        fields.push("quantity = ?");
        values.push(data.quantity);
    }

    if (data.unit_price !== undefined) {
        fields.push("unit_price = ?");
        values.push(data.unit_price);
    }

    if (data.markup !== undefined) {
        fields.push("markup = ?");
        values.push(data.markup);
    }

    if (data.purchase_shipping !== undefined) {
        fields.push("purchase_shipping = ?");
        values.push(data.purchase_shipping);
    }

    if (data.ipi !== undefined) {
        fields.push("ipi = ?");
        values.push(data.ipi);
    }

    if (data.st !== undefined) {
        fields.push("st = ?");
        values.push(data.st);
    }

    if (data.extra_value !== undefined) {
        fields.push("extra_value = ?");
        values.push(data.extra_value);
    }

    if (data.boarding !== undefined) {
        fields.push("boarding = ?");
        values.push(data.boarding);
    }

    if (!fields.length) return;

    values.push(id);

    db.prepare(`
      UPDATE item_values
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values);

    return getById(db)(id!);
}

const itemValuesRepository = (db: Database) => {
    return {
        getById: getById(db),
        getAllByReferenceId: getAllIByReferenceId(db),
        create: create(db),
        update: update(db)
    };
};

export default itemValuesRepository;
