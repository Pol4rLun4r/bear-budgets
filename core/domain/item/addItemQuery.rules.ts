import type { addItemQuery, ItemNoteQuery } from "../../types/item";
import type { QuotationVersionSummary } from "../../types/quotation";
import { success, failure } from "../../utils/handleSuccess";

export type addItemQueryRules = {
    quotationVersionExists: QuotationVersionSummary | undefined;
    quotation_version_id: number;
    items: addItemQuery[];
};

const addItemsToQuotationRules = ({ quotation_version_id, items, quotationVersionExists, }: addItemQueryRules) => {

    // verifica se a cotação existe
    if (!quotationVersionExists) {
        return failure("Versão da cotação não existe");
    }

    // verifica se o array não é vazio
    if (!items?.length) {
        return failure("Informe ao menos um item");
    }

    // items validados
    const validItems: addItemQuery[] = [];

    // validar cada item
    for (const item of items) {

        // validar ordem/posição e se os items tem a mesma posição
        const position = item.position;

        if (!position) {
            return failure("Cada item deve ter uma posição/ordem");
        } else {
            const hasSamePosition = items.filter((item) => item.position === position).length;
            if(hasSamePosition > 1) return failure(`${hasSamePosition} items tem o mesmo numero de posição: ${position}`);
        }

        // validar descrição
        const description = (item.item_basic_data.description ?? "").trim();

        // checar se descrição não está vazia
        if (!description) {
            return failure("Cada item deve ter uma descrição");
        }

        // validar quantidade
        const quantity = item.values.quantity ?? 1;

        // validá as notas se existirem
        const notes: ItemNoteQuery[] | undefined = item.notes?.map((note: ItemNoteQuery) => ({
            type: note.type,
            content: note.content?.trim(),
        })).filter((note: ItemNoteQuery) => note.content.length > 0);

        // adiciona cada nota ao array de item válidos
        validItems.push({
            position: item.position,
            item_basic_data: { ...item.item_basic_data, description },
            values: { ...item.values, quantity },
            notes
        });
    }

    return success({
        quotation_version_id,
        items: validItems,
    });
};

export default addItemsToQuotationRules;
