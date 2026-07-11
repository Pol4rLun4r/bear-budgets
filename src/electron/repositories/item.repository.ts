import type { Database } from "better-sqlite3";

const getReferenceLinksFromItem = (item: ItemData): Pick<ReferenceLink, "content">[] => {
    return (item.reference_links ?? [])
        .map((link) => ({ content: (link.content ?? "").trim() }))
        .filter((link) => link.content.length > 0);
};

// ** adiciona/cria um item ou vários itens na cotação *//
export const addToQuotationRepository = (db: Database) =>
    (quotationId: number, items: ItemData[]): QuotationLink[] => {

        // item reference
        const createRef = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm, notes)
            VALUES (?, ?, ?, ?, ?)
        `);

        // item values
        const createValues = db.prepare(`
            INSERT INTO item_values (item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, extra_value, boarding)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // links de referência do item
        const createReferenceLink = db.prepare(`
            INSERT INTO reference_links (item_reference_id, content)
            SELECT ?, ?
            WHERE NOT EXISTS (
                SELECT 1
                FROM reference_links
                WHERE item_reference_id = ?
                  AND content = ?
            )
        `);

        // conexão entre o valor do item, referencia do item e a cotação
        const link = db.prepare(`
            INSERT INTO quotation_links (quotation_id, item_reference_id, item_values_id)
            VALUES (?, ?, ?)
        `);

        const run = db.transaction(() => {
            const results: QuotationLink[] = [];

            for (const item of items) {

                // divide as informações em dados básicos(descrição e afins) e valores (preços, quantidades e etc)
                const itemReference = item.item_reference;
                const itemValues = item.item_values;

                // separa os valores para melhor manejo
                const quantity = itemValues.quantity ?? 1;
                const unitPrice = itemValues.unit_price ?? undefined;
                const markup = itemValues.markup ?? undefined;
                const purchaseShipping = itemValues.purchase_shipping ?? undefined;
                const ipi = itemValues.ipi ?? undefined;
                const st = itemValues.st ?? undefined;
                const position = itemValues.position;
                const extraValue = itemValues.extra_value ?? undefined;
                const boarding = itemValues.boarding ?? undefined;

                // if para determinar se um item precisa ser criado ou não, baseado se tem um id
                let itemReferenceId: number
                let shouldCreateReferenceLinks = false;
                if (itemReference.id) {
                    // informar apenas o id caso o item possua o mesmo
                    itemReferenceId = itemReference.id
                } else {
                    // criar item caso o não exista um id
                    itemReferenceId = createRef.run(
                        itemReference.description,
                        itemReference.internal_code ?? undefined,
                        itemReference.manufacturer_code ?? undefined,
                        itemReference.ncm ?? undefined,
                        itemReference.notes ?? undefined
                    ).lastInsertRowid as number
                    shouldCreateReferenceLinks = true;
                }

                const referenceLinks = getReferenceLinksFromItem(item);

                // Só cria links quando a referência é nova.
                // Se item_reference.id foi informado, a referência já existe e não deve receber novos links aqui.
                if (shouldCreateReferenceLinks && referenceLinks.length) {
                    for (const link of referenceLinks) {
                        createReferenceLink.run(
                            itemReferenceId,
                            link.content,
                            itemReferenceId,
                            link.content
                        );
                    }
                }

                // cria e pega o id do item_values
                const itemValuesId = createValues.run(itemReferenceId, position, quantity, unitPrice, markup, purchaseShipping, ipi, st, extraValue, boarding).lastInsertRowid;

                // cria e pega o id do quotation_link
                const linkId = link.run(quotationId, itemReferenceId, itemValuesId).lastInsertRowid;

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

//** apaga todos os item_references */
export const deleteAllItemReferencesRepository = (db: Database) => () => {
    const deleteAll = db.prepare(`
        DELETE FROM item_references
    `).run();

    return deleteAll;
};

//** pega todos os item_references */
export const getAllItemReferencesRepository = (db: Database) =>
    (): ItemReference[] => {
        const references = db.prepare(`
            SELECT *
            FROM item_references
            ORDER BY created_at ASC
            LIMIT 30
        `).all();

        return references as ItemReference[];
    };

//** pesquisa item_references pela descrição */
export const searchItemReferencesByDescriptionRepository = (db: Database) =>
    (rawQuery: Pick<ItemReference, 'description'>['description']): ItemReference[] => {
        // Evita erro de sintaxe do FTS5 e preserva tokenizers usados no índice
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


//**  busca item_values pelo id */
export const getItemValuesByIDRepository = (db: Database) =>
    (item_values_id: number): ItemValues | undefined => {
        const itemValues = db.prepare(`
            SELECT * FROM item_values WHERE id = ? LIMIT 1
        `).get(item_values_id) as ItemValues | undefined;

        return itemValues;
    };

//** busca item_reference pelo id, trazendo os dados + links de referência  */
export const getItemReferenceByIDRepository = (db: Database) =>
    (item_reference_id: number): ItemWithReferenceLinks | undefined => {
        const ref = db.prepare(`
            SELECT * FROM item_references WHERE id = ? LIMIT 1
        `).get(item_reference_id) as ItemReference | undefined;

        if (!ref) return undefined;

        const links = db.prepare(`
            SELECT * FROM reference_links
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(item_reference_id) as ReferenceLink[];

        return { ...ref, reference_links: links };
    };


//** cria a referência do item (dados mestre) */
export const createItemReferenceRepository = (db: Database) =>
    (item_reference: ItemReference): number => {
        const row = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm, notes)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            item_reference.description,
            item_reference.internal_code ?? null,
            item_reference.manufacturer_code ?? null,
            item_reference.ncm ?? null,
            item_reference.notes ?? null
        );
        return row.lastInsertRowid as number;
    };