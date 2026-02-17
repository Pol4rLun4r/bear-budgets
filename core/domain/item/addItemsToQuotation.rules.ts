import type { AddItemToQuotationInput, ItemReferenceNoteInput } from "../../../types/item";
import type { QuotationVersionSummary } from "../../repositories/quotation.repository";
import { success, failure } from "../../utils/handleSuccess";

export type AddItemsToQuotationInput = {
    quotation_version_id: number;
    items: AddItemToQuotationInput[];
};

export type AddItemsToQuotationRulesInput = AddItemsToQuotationInput & {
    quotationVersionExists: QuotationVersionSummary | undefined;
};

const addItemsToQuotationRules = ({
    quotation_version_id,
    items,
    quotationVersionExists,
}: AddItemsToQuotationRulesInput) => {
    // check if quotation version exists
    if (!quotationVersionExists) {
        return failure("Versão da cotação não existe");
    }

    // check if items array is not empty
    if (!items?.length) {
        return failure("Informe ao menos um item");
    }

    // validate items
    const validItems: AddItemToQuotationInput[] = [];

    // validate each item
    for (const item of items) {
        // validate description
        const description = (item.description ?? "").trim();

        // check if description is not empty
        if (!description) {
            return failure("Cada item deve ter uma descrição");
        }

        // validate quantity
        const quantity = item.quantity ?? 1;

        // check if quantity is greater than zero
        if (quantity <= 0) {
            return failure("Quantidade deve ser maior que zero");
        }

        // validate notes, if exist
        const notes: ItemReferenceNoteInput[] | undefined = item.notes?.map((note) => ({
            type: note.type,
            content: note.content?.trim(),
        })).filter((note) => note.content.length > 0);

        validItems.push({
            description,
            internal_code: item.internal_code ?? null,
            manufacturer_code: item.manufacturer_code ?? null,
            ncm: item.ncm ?? null,
            quantity,
            unit_price: item.unit_price ?? null,
            markup: item.markup ?? null,
            purchase_freight: item.purchase_freight ?? null,
            ipi: item.ipi ?? null,
            st: item.st ?? null,
            notes,
        });
    }

    return success({
        quotation_version_id,
        items: validItems,
    });
};

export default addItemsToQuotationRules;
