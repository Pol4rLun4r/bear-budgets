import { success, failure } from "../../utils/handleSuccess.js";

export const rulesCode = {
    QUOTATION_LINK_NOT_INFORMED: "O id de quotation_link não foi informado",
    QUOTATION_LINK_INVALID: "O id de quotation_link é inválido",
    ITEM_REFERENCE_NOT_INFORMED: "Informe a referência do item",
    ITEM_REFERENCE_DESCRIPTION_NOT_INFORMED: "Informe a descrição do item_reference",
    ITEM_VALUES_NOT_INFORMED: "Informe os valores do item",
    ITEM_REFERENCE_ID_INVALID: "O id do item_reference é inválido",
    ITEM_VALUES_ID_INVALID: "O id do item_values é inválido",
};

const normalizeText = (value?: string) => (value ?? "").trim();

const updateLine = (payload: UpdateQuotationLinePayload) => {
    if (payload.quotation_link_id === undefined || payload.quotation_link_id === null) {
        return failure(rulesCode.QUOTATION_LINK_NOT_INFORMED);
    }

    if (typeof payload.quotation_link_id !== "number" || payload.quotation_link_id <= 0) {
        return failure(rulesCode.QUOTATION_LINK_INVALID);
    }

    if (!payload.item_reference || typeof payload.item_reference !== "object") {
        return failure(rulesCode.ITEM_REFERENCE_NOT_INFORMED);
    }

    if (!payload.item_values || typeof payload.item_values !== "object") {
        return failure(rulesCode.ITEM_VALUES_NOT_INFORMED);
    }

    if (payload.item_reference.id !== undefined && payload.item_reference.id !== null) {
        if (typeof payload.item_reference.id !== "number" || payload.item_reference.id <= 0) {
            return failure(rulesCode.ITEM_REFERENCE_ID_INVALID);
        }
    }

    if (payload.item_values.id !== undefined && payload.item_values.id !== null) {
        if (typeof payload.item_values.id !== "number" || payload.item_values.id <= 0) {
            return failure(rulesCode.ITEM_VALUES_ID_INVALID);
        }
    }

    const hasReferenceId = typeof payload.item_reference.id === "number" && payload.item_reference.id > 0;
    const description = normalizeText(payload.item_reference.description);

    if (!hasReferenceId && !description) {
        return failure(rulesCode.ITEM_REFERENCE_DESCRIPTION_NOT_INFORMED);
    }

    const normalizedItemReference = {
        ...payload.item_reference,
        description: description || undefined,
        internal_code: payload.item_reference.internal_code ? normalizeText(payload.item_reference.internal_code) || undefined : undefined,
        manufacturer_code: payload.item_reference.manufacturer_code ? normalizeText(payload.item_reference.manufacturer_code) || undefined : undefined,
        ncm: payload.item_reference.ncm ? normalizeText(payload.item_reference.ncm) || undefined : undefined,
        notes: payload.item_reference.notes ? normalizeText(payload.item_reference.notes) || undefined : undefined,
    };

    const normalizedItemValues = {
        ...payload.item_values,
        quantity: payload.item_values.quantity ?? undefined,
        position: payload.item_values.position ?? undefined,
    };

    const normalizedReferenceLinks = (payload.reference_links ?? [])
        .map((link) => ({ content: normalizeText(link?.content) }))
        .filter((link) => link.content.length > 0);

    return success({
        quotation_link_id: payload.quotation_link_id,
        item_reference: normalizedItemReference,
        item_values: normalizedItemValues,
        reference_links: normalizedReferenceLinks,
    });
};

export default updateLine;
