import type { Database } from "better-sqlite3";
import type {
    ItemNote,
    ItemNoteQuery,
    ItemReference,
    ItemVersion,
    ItemValues,
    ItemWithNotes,
    addItemQuery,
    AddedItemResult,
    QuotationVersionItem,
} from "../types/item";

// cria a referência do item (dados mestre).
export const createItemReferenceRepository = (db: Database) =>
    (data: addItemQuery): number => {
        const row = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `).run(
            data.item_basic_data.description,
            data.item_basic_data.internal_code ?? null,
            data.item_basic_data.manufacturer_code ?? null,
            data.item_basic_data.ncm ?? null
        );
        return row.lastInsertRowid as number;
    };

// cria a primeira (ou próxima) versão do item.
export const createItemVersionRepository = (db: Database) =>
    (
        itemReferenceId: number,
        version: number,
        quantity: number,
        unitPrice: number | null,
        markup: number | null,
        purchaseFreight: number | null,
        ipi: number | null,
        st: number | null
    ): number => {
        const row = db.prepare(`
            INSERT INTO item_versions (item_reference_id, version, quantity, unit_price, markup, purchase_freight, ipi, st)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(itemReferenceId, version, quantity, unitPrice, markup, purchaseFreight, ipi, st);
        return row.lastInsertRowid as number;
    };

// cria uma nota de referência do item (texto ou link).
export const createItemReferenceNoteRepository = (db: Database) =>
    (itemReferenceId: number, data: ItemNoteQuery): ItemNote => {
        const row = db.prepare(`
            INSERT INTO item_reference_notes (item_reference_id, type, content)
            VALUES (?, ?, ?)
            RETURNING id, item_reference_id, type, content, created_at, updated_at
        `).get(itemReferenceId, data.type, data.content) as ItemNote;
        return row;
    };

// busca as notas de referência de um item_reference pelo id da referência.
export const getItemReferenceNotesByReferenceIdRepository = (db: Database) =>
    (itemReferenceId: number): ItemNote[] => {
        return db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_reference_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(itemReferenceId) as ItemNote[];
    };

// vincula uma versão do item a uma versão da cotação.
// usado para buscar ou edições futuras do item.
export const linkItemVersionToQuotationVersionRepository = (db: Database) =>
    (quotationVersionId: number, itemVersionId: number): number => {
        const row = db.prepare(`
            INSERT INTO quotation_version_items (quotation_version_id, item_version_id)
            VALUES (?, ?)
        `).run(quotationVersionId, itemVersionId);
        return row.lastInsertRowid as number;
    };

// adiciona um ou mais itens à versão da cotação em uma única transação:
// para cada item: cria referência → cria versão 1 → vincula à quotation_version.
export const addItemsToQuotationVersionRepository = (db: Database) =>
    (quotationVersionId: number, items: addItemQuery[]): AddedItemResult[] => {

        // item reference
        const createRef = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `);

        // item version
        const createVersion = db.prepare(`
            INSERT INTO item_versions (item_reference_id, position, version, quantity, unit_price, markup, purchase_freight, ipi, st)
            VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)
        `);

        // notas do item
        const createNote = db.prepare(`
            INSERT INTO item_notes (item_reference_id, type, content)
            VALUES (?, ?, ?)
        `);

        // conexão entre a versão do item, versão da referencia e a versão da cotação
        const link = db.prepare(`
            INSERT INTO quotation_links (quotation_version_id, item_reference_id, item_version_id)
            VALUES (?, ?, ?)
        `);

        const run = db.transaction(() => {
            const results: any[] = [];
            for (const item of items) {

                // divide as informações em dados básicos(descrição e afins) e valores (preços, quantidades e etc)
                const dataItemBasic = item.item_basic_data;
                const dataValues = item.values;

                // separa os valores para melhor manejo
                const quantity = dataValues.quantity ?? 1;
                const unitPrice = dataValues.unit_price ?? null;
                const markup = dataValues.markup ?? null;
                const purchaseShipping = dataValues.purchase_shipping ?? null;
                const ipi = dataValues.ipi ?? null;
                const st = dataValues.st ?? null;

                // if para determinar se um item precisa ser criado ou não, baseado se tem um id
                let itemReferenceId: number
                if (dataItemBasic.id) {
                    // informar apenas o id caso o item possua o mesmo
                    itemReferenceId = dataItemBasic.id
                } else {
                    // criar item caso o não exista um id
                    itemReferenceId = createRef.run(
                        dataItemBasic.description,
                        dataItemBasic.internal_code ?? null,
                        dataItemBasic.manufacturer_code ?? null,
                        dataItemBasic.ncm ?? null
                    ).lastInsertRowid as number
                }

                // Cria notas de referência (se existirem)
                if (item.notes?.length) {
                    for (const note of item.notes) {
                        createNote.run(
                            itemReferenceId,
                            note.type,
                            note.content
                        );
                    }
                }

                // id do item_version
                const itemVersionId = createVersion.run(itemReferenceId, item.position, quantity, unitPrice, markup, purchaseShipping, ipi, st).lastInsertRowid;

                // id do quotation_link
                const linkId = link.run(quotationVersionId, itemReferenceId, itemVersionId).lastInsertRowid;

                // pega os dados do quotation_link
                const getLinkData = db.prepare(`
                    SELECT *
                    FROM quotation_links
                    WHERE id = ?
                    LIMIT 1
                `).get(linkId);
                
                // insere os dados do quotation_link em cada "for" em results
                results.push(getLinkData);
            }
            return results;
        });

        return run();
    };

// busca referência por id com notas da referência
export const getItemReferenceByIdRepository = (db: Database) =>
    (id: number): ItemWithNotes | undefined => {
        const ref = db.prepare(`
            SELECT * FROM item_references WHERE id = ? LIMIT 1
        `).get(id) as ItemReference | undefined;

        if (!ref) return undefined;

        const notes = db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_reference_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(id) as ItemNote[];

        return { ...ref, notes };
    };

// pesquisa referências por descrição
export const searchItemReferencesByDescriptionRepository = (db: Database) =>
    (rawQuery: string): ItemReference[] => {

        // divide a query em palavras separadas por espaços e filtra as palavras vazias
        const words = rawQuery
            .toLowerCase() // converte para minúsculas para facilitar a pesquisa
            .trim() // remove espaços em branco no início e no fim
            .split(/\s+/) // divide em palavras separadas por espaços
            .filter(Boolean); // filtra as palavras vazias

        // se não houver palavras, retorna um array vazio
        if (!words.length) {
            return [];
        }

        // constrói as cláusulas WHERE para cada palavra
        const whereClauses = words.map((word) => "LOWER(description) LIKE '%' || ? || '%'");

        // constrói a query de pesquisa
        const sql = `
            SELECT *
            FROM item_references
            WHERE ${whereClauses.join(" AND ")}
            ORDER BY description
            LIMIT 8
        `;

        // constrói os parâmetros para a query
        const params = words.map(w => w.toLowerCase());

        // executa a query e retorna os resultados
        return db.prepare(sql).all(...params) as ItemReference[];
    };