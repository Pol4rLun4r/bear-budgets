import type { Database } from "better-sqlite3";
import type {
    ItemReferenceType,
    ItemReferenceWithNotesType,
    ItemReferenceNoteType,
    ItemVersionType,
    AddItemToQuotationInput,
    AddedItemResult,
    ItemReferenceNoteInput,
} from "../types/item";


// cria a referência do item (dados mestre).
export const createItemReferenceRepository = (db: Database) =>
    (data: Pick<AddItemToQuotationInput, "description" | "internal_code" | "manufacturer_code" | "ncm">): number => {
        const row = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `).run(
            data.description,
            data.internal_code ?? null,
            data.manufacturer_code ?? null,
            data.ncm ?? null
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
    (itemReferenceId: number, data: ItemReferenceNoteInput): ItemReferenceNoteType => {
        const row = db.prepare(`
            INSERT INTO item_reference_notes (item_reference_id, type, content)
            VALUES (?, ?, ?)
            RETURNING id, item_reference_id, type, content, created_at, updated_at
        `).get(itemReferenceId, data.type, data.content) as ItemReferenceNoteType;
        return row;
    };

// busca as notas de referência de um item_reference pelo id da referência.
export const getItemReferenceNotesByReferenceIdRepository = (db: Database) =>
    (itemReferenceId: number): ItemReferenceNoteType[] => {
        return db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_reference_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(itemReferenceId) as ItemReferenceNoteType[];
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
    (quotationVersionId: number, items: AddItemToQuotationInput[]): AddedItemResult[] => {
        // item reference
        const createRef = db.prepare(`
            INSERT INTO item_references (description, internal_code, manufacturer_code, ncm)
            VALUES (?, ?, ?, ?)
        `);

        // item version
        const createVersion = db.prepare(`
            INSERT INTO item_versions (item_reference_id, version, quantity, unit_price, markup, purchase_freight, ipi, st)
            VALUES (?, 1, ?, ?, ?, ?, ?, ?)
        `);

        // notas do item
        const createNote = db.prepare(`
            INSERT INTO item_reference_notes (item_reference_id, type, content)
            VALUES (?, ?, ?)
        `);

        // conexão entre a versão do item e a versão da cotação
        const link = db.prepare(`
            INSERT INTO quotation_version_items (quotation_version_id, item_version_id)
            VALUES (?, ?)
        `);

        const run = db.transaction(() => {
            const results: AddedItemResult[] = [];
            for (const item of items) {

                const quantity = item.quantity ?? 1;
                const unitPrice = item.unit_price ?? null;
                const markup = item.markup ?? null;
                const purchaseShipping = item.purchase_shipping ?? null;
                const ipi = item.ipi ?? null;
                const st = item.st ?? null;

                const refRow = createRef.run(
                    item.description,
                    item.internal_code ?? null,
                    item.manufacturer_code ?? null,
                    item.ncm ?? null
                );

                const itemReferenceId = refRow.lastInsertRowid as number;

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

                const versionRow = createVersion.run(itemReferenceId, quantity, unitPrice, markup, purchaseShipping, ipi, st);
                const itemVersionId = versionRow.lastInsertRowid as number;

                const linkRow = link.run(quotationVersionId, itemVersionId);
                const quotationVersionItemId = linkRow.lastInsertRowid as number;

                results.push({ item_reference_id: itemReferenceId, item_version_id: itemVersionId, quotation_version_item_id: quotationVersionItemId });
            }
            return results;
        });

        return run();
    };

// busca referência por id com notas da referência
export const getItemReferenceByIdRepository = (db: Database) =>
    (id: number): ItemReferenceWithNotesType | undefined => {
        const ref = db.prepare(`
            SELECT * FROM item_references WHERE id = ? LIMIT 1
        `).get(id) as ItemReferenceType | undefined;

        if (!ref) return undefined;

        const notes = db.prepare(`
            SELECT id, item_reference_id, type, content, created_at, updated_at
            FROM item_reference_notes
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(id) as ItemReferenceNoteType[];

        return { ...ref, notes };
    };

// pesquisa referências por descrição
export const searchItemReferencesByDescriptionRepository = (db: Database) =>
    (rawQuery: string): ItemReferenceType[] => {

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
        return db.prepare(sql).all(...params) as ItemReferenceType[];
    };