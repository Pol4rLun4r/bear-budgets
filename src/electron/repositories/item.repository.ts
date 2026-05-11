import type { Database } from "better-sqlite3";

// cria a referência do item (dados mestre).
export const createItemReferenceRepository = (db: Database) =>
    (item_reference: ItemReference): number => {
        const row = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `).run(
            item_reference.description,
            item_reference.internal_code ?? null,
            item_reference.manufacturer_code ?? null,
            item_reference.ncm ?? null
        );
        return row.lastInsertRowid as number;
    };

// cria uma nota de referência do item (texto ou link).
export const createItemNoteRepository = (db: Database) =>
    (item_reference_id: number, data: ItemNote): number => {
        const row = db.prepare(`
            INSERT INTO item_notes (item_reference_id, type, content)
            SELECT ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1
                FROM item_notes
                WHERE item_reference_id = ?
                  AND type = ?
                  AND content = ?
            )
        `).run(
            item_reference_id,
            data.type,
            data.content,
            item_reference_id,
            data.type,
            data.content
        )
        return row.lastInsertRowid as number;
    };

// busca as notas de referência de um item_reference pelo id da referência.
export const getItemRNotesByReferenceIdRepository = (db: Database) =>
    (item_reference_id: number): ItemNote[] => {
        return db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(item_reference_id) as ItemNote[];
    };

// adiciona um ou mais itens à versão da cotação em uma única transação:
// para cada item: cria referência → cria versão 1 → vincula à quotation_version.
export const addItemsToQuotationVersionRepository = (db: Database) =>
    (quotationVersionId: number, items: ItemData[]): QuotationLink[] => {

        const quotationParent = db.prepare(`
            SELECT quotation_id FROM quotation_versions WHERE id = ?
        `).get(quotationVersionId) as { quotation_id: number } | undefined;

        if (!quotationParent) {
            throw new Error(`quotation_versions inexistente: ${quotationVersionId}`);
        }

        const quotationId = quotationParent.quotation_id;

        // item reference
        const createRef = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `);

        // item version
        const createVersion = db.prepare(`
            INSERT INTO item_versions (item_reference_id, position, version, quantity, unit_price, markup, purchase_shipping, ipi, st)
            VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)
        `);

        // notas do item
        const createNote = db.prepare(`
            INSERT INTO item_notes (item_reference_id, type, content)
            SELECT ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1
                FROM item_notes
                WHERE item_reference_id = ?
                  AND type = ?
                  AND content = ?
            )
        `);

        // conexão entre a versão do item, versão da referencia e a versão da cotação
        const link = db.prepare(`
            INSERT INTO quotation_links (quotation_id, item_reference_id, item_version_id)
            VALUES (?, ?, ?)
        `);

        const run = db.transaction(() => {
            const results: QuotationLink[] = [];

            for (const item of items) {

                // divide as informações em dados básicos(descrição e afins) e valores (preços, quantidades e etc)
                const itemReference = item.item_reference;
                const itemVersion = item.item_version;

                // separa os valores para melhor manejo
                const quantity = itemVersion.quantity ?? 1;
                const unitPrice = itemVersion.unit_price ?? undefined;
                const markup = itemVersion.markup ?? undefined;
                const purchaseShipping = itemVersion.purchase_shipping ?? undefined;
                const ipi = itemVersion.ipi ?? undefined;
                const st = itemVersion.st ?? undefined;
                const position = itemVersion.position;

                // if para determinar se um item precisa ser criado ou não, baseado se tem um id
                let itemReferenceId: number
                let shouldCreateNotes = false;
                if (itemReference.id) {
                    // informar apenas o id caso o item possua o mesmo
                    itemReferenceId = itemReference.id
                } else {
                    // criar item caso o não exista um id
                    itemReferenceId = createRef.run(
                        itemReference.description,
                        itemReference.internal_code ?? undefined,
                        itemReference.manufacturer_code ?? undefined,
                        itemReference.ncm ?? undefined
                    ).lastInsertRowid as number
                    shouldCreateNotes = true;
                }

                // Só cria notas quando a referência é nova.
                // Se item_reference.id foi informado, a referência já existe e não deve receber novas notas aqui.
                if (shouldCreateNotes && item.notes?.length) {
                    for (const note of item.notes) {
                        createNote.run(
                            itemReferenceId,
                            note.type,
                            note.content,
                            itemReferenceId,
                            note.type,
                            note.content
                        );
                    }
                }

                // id do item_version
                const itemVersionId = createVersion.run(itemReferenceId, position, quantity, unitPrice, markup, purchaseShipping, ipi, st).lastInsertRowid;

                // id do quotation_link
                const linkId = link.run(quotationId, itemReferenceId, itemVersionId).lastInsertRowid;

                // pega os dados do quotation_link
                const getLinkData = db.prepare(`
                    SELECT *
                    FROM quotation_links
                    WHERE id = ?
                    LIMIT 1
                `).get(linkId) as QuotationLink;

                // insere os dados do quotation_link em cada "for" em results
                results.push(getLinkData);
            }
            return results;
        });

        return run();
    };

// busca referência do item pelo id, trazendo os dados + notas da referência
export const getItemReferenceByIdRepository = (db: Database) =>
    (item_reference_id: number): ItemWithNotes | undefined => {
        const ref = db.prepare(`
            SELECT * FROM item_references WHERE id = ? LIMIT 1
        `).get(item_reference_id) as ItemReference | undefined;

        if (!ref) return undefined;

        const notes = db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(item_reference_id) as ItemNote[];

        return { ...ref, notes };
    };

// busca versão do item pelo id
export const getItemVersionByIdRepository = (db: Database) =>
    (item_version_id: number): ItemVersion | undefined => {
        const itemVersion = db.prepare(`
            SELECT * FROM item_versions WHERE id = ? LIMIT 1
        `).get(item_version_id) as ItemVersion | undefined;

        return itemVersion;
    };

// pesquisa referências por descrição
export const searchItemReferencesByDescriptionRepository = (db: Database) =>
    (rawQuery: Pick<ItemReference, 'description'>['description']): ItemReference[] => {
        // Evita erro de sintaxe do FTS5 e preserva tokenchars usados no índice
        // para permitir buscas por códigos como 3LD2164-0TB53-0US2.
        const terms = rawQuery.match(/[\p{L}\p{N}._,/-]+/gu) ?? [];
        const query = terms
            .map(term => `"${term.replace(/"/g, '""')}"*`)
            .join(" ");

        if (!query) return [];

        const sql = `
            SELECT ir.*
            FROM item_references_search s
            JOIN item_references ir ON ir.id = s.rowid
            WHERE s.description MATCH ?
            ORDER BY rank
            LIMIT 8
        `;

        return db.prepare(sql).all(query) as ItemReference[];
    };

export const deleteAllItemReferencesRepository = (db: Database) => () => {
    const deleteAll = db.prepare(`
        DELETE FROM item_references
    `).run();

    return deleteAll;
};

export const deleteAllItemNotesByIdReference = (db: Database) =>
    (item_reference_id: ItemNote['item_reference_id']) => {
        const deleteAll = db.prepare(`
            DELETE FROM item_notes
            WHERE item_reference_id = ?
        `).run(item_reference_id);

        return deleteAll;
    };