export const defaultItemReferenceSimpleFields: ItemReferenceSimpleField[] = ["internalCode"];

export const defaultItemValuesSimpleFields: ItemValuesSimpleField[] = [
    "historyPrice",
    "boarding",
    "delivery",
    "purchaseShipping",
    "totalWithoutTaxes",
    "markupValue",
    "ipiValue",
    "stValue",
    "totalWithIPIandST",
    "totalWithAll",
    "finalUnitValue",
];

export const itemReferenceRequiredFields = [
    {
        label: "Descrição",
        description: "Identifica o item e permanece sempre visível.",
    },
];

export const itemValuesRequiredFields = [
    {
        label: "Preço unitário",
        description: "Define o preço por unidade do item.",
    },
    {
        label: "Quantidade",
        description: "Define quantas unidades do item serão consideradas.",
    },
    {
        label: "Markup",
        description: "Define a margem aplicada ao cálculo do item.",
    },
];

export const itemReferenceSimpleFields: {
    id: ItemReferenceSimpleField;
    label: string;
    description: string;
}[] = [
    {
        id: "internalCode",
        label: "Código interno",
        description: "Código usado para identificar o item no aplicativo.",
    },
    {
        id: "manufacturerCode",
        label: "Código do fabricante",
        description: "Identificador do item fornecido pelo fabricante.",
    },
    {
        id: "ncm",
        label: "NCM",
        description: "Código da Nomenclatura Comum do Mercosul do item.",
    },
    {
        id: "notes",
        label: "Notas",
        description: "Observações adicionais sobre o item.",
    },
    {
        id: "links",
        label: "Links de referência",
        description: "Links de consulta, compra ou referência relacionados ao item.",
    },
];

export const itemValuesSimpleFields: {
    id: ItemValuesSimpleField;
    label: string;
    description: string;
}[] = [
    {
        id: "historyPrice",
        label: "Histórico de valores",
        description: "Acesso ao histórico de valores do item.",
    },
    {
        id: "ipi",
        label: "IPI",
        description: "Campo para informar o percentual de IPI do item.",
    },
    {
        id: "st",
        label: "ST",
        description: "Campo para informar o valor ou percentual de substituição tributária.",
    },
    {
        id: "extraValue",
        label: "Valor extra",
        description: "Campo para informar um valor adicional do item.",
    },
    {
        id: "boarding",
        label: "Embarque",
        description: "Campo para informar o prazo de embarque do item.",
    },
    {
        id: "delivery",
        label: "Entrega",
        description: "Campo para informar o prazo de entrega do item.",
    },
    {
        id: "purchaseShipping",
        label: "Frete de compra",
        description: "Campo para informar o custo de frete da compra.",
    },
    {
        id: "totalWithoutTaxes",
        label: "Total sem impostos",
        description: "Exibe o valor total calculado antes dos impostos.",
    },
    {
        id: "markupValue",
        label: "Valor do markup",
        description: "Exibe o valor calculado para o markup.",
    },
    {
        id: "ipiValue",
        label: "Valor do IPI",
        description: "Exibe o valor calculado do IPI.",
    },
    {
        id: "stValue",
        label: "Valor ST",
        description: "Exibe o valor calculado da substituição tributária.",
    },
    {
        id: "totalWithIPIandST",
        label: "Total com IPI e ST",
        description: "Exibe o total calculado incluindo IPI e substituição tributária.",
    },
    {
        id: "totalWithAll",
        label: "Total geral com impostos",
        description: "Exibe o valor geral calculado com os impostos.",
    },
    {
        id: "finalUnitValue",
        label: "Valor unitário final",
        description: "Exibe o valor final calculado por unidade.",
    },
];
