const calculationSummaryFields: ItemValuesSimpleField[] = [
    "totalWithoutTaxes",
    "markupValue",
    "ipiValue",
    "stValue",
    "totalWithIPIandST",
    "totalWithAll",
    "finalUnitValue",
];

const calculationDetailFields: ItemValuesSimpleField[] = [
    "ipiValue",
    "stValue",
    "totalWithIPIandST",
    "markupValue",
    "extraValue",
    "purchaseShipping",
];

// indica se o resumo do cálculo deve aparecer, conforme o modo simples e os campos visíveis
const hasVisibleCalculationSummary = (
    simpleMode: boolean,
    visibleFields: readonly ItemValuesSimpleField[],
) => {
    if (!simpleMode) return true;

    const visible = new Set(visibleFields);

    return (
        calculationSummaryFields.some((field) => visible.has(field)) ||
        (visible.has("boarding") && visible.has("delivery"))
    );
};

export const hasVisibleCalculationDetails = (
    simpleMode: boolean,
    visibleFields: readonly ItemValuesSimpleField[],
) =>
    !simpleMode || calculationDetailFields.some((field) => visibleFields.includes(field));

export default hasVisibleCalculationSummary;
