import { success, failure } from "../../utils/handleSuccess.js";

export interface CreateAndAdd {
    items: ItemData[];
    quotationExists: boolean;
}

export const rulesCode = {
    NO_ITEMS: "Informe ao menos um item",
    POSITION_NOT_INFORMED: "Cada item deve ter uma posição/ordem",
    SAME_POSITION: "Não é permitido ter mais de um item com a mesma posição/ordem",
    DESCRIPTION_NOT_INFORMED: "Cada item deve ter uma descrição",
    QUOTATION_NOT_EXISTS: "Não é possível adicionar itens a uma cotação que não existe",
}

/** Verifica a criação e adição de um item ou mais de um a uma cotação (informando referencias e valores de um item) */
const createAndAdd = ({ items, quotationExists }: CreateAndAdd) => {

    // verifica se a cotação existe
    if (!quotationExists) {
        return failure(rulesCode.QUOTATION_NOT_EXISTS);
    }

    // verifica se o array não é vazio
    if (!items?.length) {
        return failure(rulesCode.NO_ITEMS);
    }

    // items validados
    const validItems: ItemData[] = [];

    // validar cada item
    for (const item of items) {

        // separa os dados básicos, valores e links do item para melhor manejo
        const { item_reference, item_values, reference_links: itemReferenceLinks } = item;

        // validar ordem/posição e se os items tem a mesma posição
        const position = item_values.position;

        if (position === undefined) {
            return failure(rulesCode.POSITION_NOT_INFORMED);
        } else {
            // checar se tem outro item com a mesma posição usando filter + length, caso tenha mais de 1 item com a mesma posição, retorna erro;
            const hasSamePosition = items.filter((item) => item.item_values.position === position).length;
            if (hasSamePosition > 1) return failure(rulesCode.SAME_POSITION);
        }

        // validar descrição
        const description = (item_reference.description ?? "").trim();

        // checar se descrição não está vazia
        if (!description) {
            return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
        }

        // validar notas do item, caso existam
        const notes = (item_reference.notes ?? "").trim();

        // validar quantidade
        const quantity = item_values.quantity ?? 1;

        // valida os links de referência se existirem
        const reference_links = itemReferenceLinks
            ?.map((link: Partial<ReferenceLink>) => ({
                content: (link.content ?? "").trim(),
            }))
            .filter((link) => link.content.length > 0) as ReferenceLink[];

        validItems.push({
            item_reference: {
                ...item_reference,
                description,
                notes: notes.length !== 0 ? notes : undefined,
            },
            item_values: { ...item_values, quantity },
            reference_links: reference_links ?? [],
        });
    }

    return success({ items: validItems });
}

export default createAndAdd;