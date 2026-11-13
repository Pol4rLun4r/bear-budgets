import type { Database } from "better-sqlite3";

/** cria a referência do item (dados mestre) */
export const create = (db: Database) =>
    (item_reference: ItemReference): number => {
        const row = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm, notes)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            item_reference.description,
            item_reference.internal_code ?? undefined,
            item_reference.manufacturer_code ?? undefined,
            item_reference.ncm ?? undefined,
            item_reference.notes ?? undefined
        );
        return row.lastInsertRowid as number;
    };


/** busca item_reference pelo id, trazendo os dados + links de referência  */
export const getById = (db: Database) =>
    (item_reference_id: number): ItemWithReferenceLinks | undefined => {
        const ref = db.prepare(`
            SELECT
                id,
                description,
                internal_code,
                manufacturer_code,
                ncm,
                notes,
                datetime(created_at, 'localtime') AS created_at,
                datetime(updated_at, 'localtime') AS updated_at
            FROM item_references
            WHERE id = ?
            LIMIT 1
        `).get(item_reference_id) as ItemReference | undefined;

        if (!ref) return undefined;

        const links = db.prepare(`
            SELECT
                id,
                item_reference_id,
                content,
                datetime(created_at, 'localtime') AS created_at
            FROM reference_links
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(item_reference_id) as ReferenceLink[];

        return { ...ref, reference_links: links };
    };

/** busca item_reference pelo id, trazendo apenas os dados principais sem o reference_link */
export const getByIdWithoutLinks = (db: Database) =>
    (item_reference_id: number): ItemReference | undefined => {
        const ref = db.prepare(`
            SELECT
                id,
                description,
                internal_code,
                manufacturer_code,
                ncm,
                notes,
                datetime(created_at, 'localtime') AS created_at,
                datetime(updated_at, 'localtime') AS updated_at
            FROM item_references
            WHERE id = ?
            LIMIT 1
        `).get(item_reference_id) as ItemReference | undefined;

        return ref;
    };

/** busca item_references por IDs, trazendo apenas os dados principais sem os links */
export const getByIds = (db: Database) =>
    (item_reference_ids: number[]): ItemReference[] => {
        if (item_reference_ids.length === 0) return [];

        const placeholders = item_reference_ids.map(() => "?").join(", ");
        return db.prepare(`
            SELECT
                id,
                description,
                internal_code,
                manufacturer_code,
                ncm,
                notes,
                datetime(created_at, 'localtime') AS created_at,
                datetime(updated_at, 'localtime') AS updated_at
            FROM item_references
            WHERE id IN (${placeholders})
        `).all(...item_reference_ids) as ItemReference[];
    };

const createDescriptionSearchQuery = (rawQuery: string) => {
    // Preserve tokenizers used by the index for codes like 3LD2164-0TB53-0US2.
    const terms = rawQuery.match(/[\p{L}\p{N}._,/-]+/gu) ?? [];
    return terms
        .map(term => `"${term.replace(/"/g, '""')}"*`)
        .join(" ");
};

/** pesquisa item_references pela descrição */
export const searchByDescription = (db: Database) =>
    (rawQuery: Pick<ItemReference, 'description'>['description']): ItemReference[] => {
        const query = createDescriptionSearchQuery(rawQuery);
        if (!query) return [];

        const sql = `
            SELECT
                ir.id,
                ir.description,
                ir.internal_code,
                ir.manufacturer_code,
                ir.ncm,
                ir.notes,
                datetime(ir.created_at, 'localtime') AS created_at,
                datetime(ir.updated_at, 'localtime') AS updated_at
            FROM item_references_search s
            JOIN item_references ir ON ir.id = s.rowid
            WHERE s.description MATCH ?
            ORDER BY rank
            LIMIT 8
        `;

        return db.prepare(sql).all(query) as ItemReference[];
    };

/** pesquisa item_references pela descrição ou pelos códigos */
export const searchByDescriptionOrCodes = (db: Database) =>
    (rawQuery: SearchItemReferenceQuery): ItemReference[] => {
        const search = typeof rawQuery === "string"
            ? { description: rawQuery, internal_code: "", manufacturer_code: "" }
            : {
                description: rawQuery.description?.trim() ?? "",
                internal_code: rawQuery.internal_code?.trim() ?? "",
                manufacturer_code: rawQuery.manufacturer_code?.trim() ?? "",
            };
        const matches: string[] = [];
        const parameters: string[] = [];
        const descriptionQuery = createDescriptionSearchQuery(search.description);

        if (descriptionQuery) {
            matches.push(`
                SELECT s.rowid AS id, 1 AS priority, rank AS relevance
                FROM item_references_search s
                WHERE s.description MATCH ?
            `);
            parameters.push(descriptionQuery);
        }

        if (search.description) {
            const pattern = `%${search.description.replace(/[!%_]/g, "!$&")}%`;
            matches.push(`
                SELECT
                    ir.id,
                    0 AS priority,
                    CASE
                        WHEN ir.internal_code = ? OR ir.manufacturer_code = ? THEN 0
                        ELSE 1
                    END AS relevance
                FROM item_references ir
                WHERE ir.internal_code LIKE ? ESCAPE '!'
                    OR ir.manufacturer_code LIKE ? ESCAPE '!'
            `);
            parameters.push(search.description, search.description, pattern, pattern);
        }

        if (search.internal_code) {
            const pattern = `%${search.internal_code.replace(/[!%_]/g, "!$&")}%`;
            matches.push(`
                SELECT
                    ir.id,
                    0 AS priority,
                    CASE WHEN ir.internal_code = ? THEN 0 ELSE 1 END AS relevance
                FROM item_references ir
                WHERE ir.internal_code LIKE ? ESCAPE '!'
            `);
            parameters.push(search.internal_code, pattern);
        }

        if (search.manufacturer_code) {
            const pattern = `%${search.manufacturer_code.replace(/[!%_]/g, "!$&")}%`;
            matches.push(`
                SELECT
                    ir.id,
                    0 AS priority,
                    CASE WHEN ir.manufacturer_code = ? THEN 0 ELSE 1 END AS relevance
                FROM item_references ir
                WHERE ir.manufacturer_code LIKE ? ESCAPE '!'
            `);
            parameters.push(search.manufacturer_code, pattern);
        }

        if (matches.length === 0) return [];

        const sql = `
            WITH matched_references AS (
                ${matches.join("\nUNION ALL\n")}
            ),
            ranked_references AS (
                SELECT id, priority, relevance
                FROM (
                    SELECT
                        id,
                        priority,
                        relevance,
                        ROW_NUMBER() OVER (
                            PARTITION BY id
                            ORDER BY priority, relevance
                        ) AS match_rank
                    FROM matched_references
                )
                WHERE match_rank = 1
            )
            SELECT
                ir.id,
                ir.description,
                ir.internal_code,
                ir.manufacturer_code,
                ir.ncm,
                ir.notes,
                datetime(ir.created_at, 'localtime') AS created_at,
                datetime(ir.updated_at, 'localtime') AS updated_at
            FROM ranked_references rr
            JOIN item_references ir ON ir.id = rr.id
            ORDER BY rr.priority, rr.relevance
            LIMIT 8
        `;

        return db.prepare(sql).all(...parameters) as ItemReference[];
    };

/** apaga todos os item_references */
const deleteAll = (db: Database) => () => {
    const deleteAll = db.prepare(`
        DELETE FROM item_references
    `).run();

    return deleteAll;
};

/** pega todos os item_references */
export const getAll = (db: Database) =>
    (): ItemReference[] => {
        const references = db.prepare(`
            SELECT
                id,
                description,
                internal_code,
                manufacturer_code,
                ncm,
                notes,
                datetime(created_at, 'localtime') AS created_at,
                datetime(updated_at, 'localtime') AS updated_at
            FROM item_references
            ORDER BY created_at DESC, id DESC
            LIMIT 50
        `).all();

        return references as ItemReference[];
    };

type ItemReferenceUpdateFields = {
    description?: string;
    internal_code?: string | null;
    manufacturer_code?: string | null;
    ncm?: string | null;
    notes?: string | null;
};

const update = (db: Database) =>
    (id: ItemReference['id'], item_reference: ItemReferenceUpdateFields) => {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (item_reference.description !== undefined) {
            fields.push("description = ?");
            values.push(item_reference.description);
        }

        if (item_reference.internal_code !== undefined) {
            fields.push("internal_code = ?");
            values.push(item_reference.internal_code ?? null);
        }

        if (item_reference.manufacturer_code !== undefined) {
            fields.push("manufacturer_code = ?");
            values.push(item_reference.manufacturer_code ?? null);
        }

        if (item_reference.ncm !== undefined) {
            fields.push("ncm = ?");
            values.push(item_reference.ncm ?? null);
        }

        if (item_reference.notes !== undefined) {
            fields.push("notes = ?");
            values.push(item_reference.notes ?? null);
        }

        if (!fields.length) return;

        values.push(id);

        db.prepare(`
            UPDATE item_references
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(...values);

        return getByIdWithoutLinks(db)(id!);
    }


const itemReferenceRepository = (db: Database) => {
    return {
        create: create(db),
        getById: getById(db),
        getByIdWithoutLinks: getByIdWithoutLinks(db),
        getByIds: getByIds(db),
        deleteAll: deleteAll(db),
        getAll: getAll(db),
        searchByDescription: searchByDescription(db),
        searchByDescriptionOrCodes: searchByDescriptionOrCodes(db),
        update: update(db)
    };
};

export default itemReferenceRepository;