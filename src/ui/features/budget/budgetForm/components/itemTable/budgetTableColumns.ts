export const budgetTableColumns = [
    {
        id: "description",
        label: "Descrição",
        description: "Mostra a descrição cadastrada para o item.",
        width: "20%",
    },
    {
        id: "internalCode",
        label: "Código interno",
        description: "Mostra o código interno usado para identificar o item.",
        width: "10%",
    },
    {
        id: "unitPrice",
        label: "Valor unitário",
        description: "Mostra o valor final de uma unidade do item.",
        width: "10%",
    },
    {
        id: "quantity",
        label: "Qtd",
        description: "Mostra a quantidade de unidades deste item no orçamento.",
        width: "8%",
    },
    {
        id: "totalWithAdditions",
        label: "Total c/ somas",
        description: "Mostra o total do item com os valores adicionais considerados no cálculo.",
        width: "10%",
    },
    {
        id: "shippingAndDelivery",
        label: "Previsão de entrega",
        description: "Mostra a previsão de entrega do item, considerando os prazos de embarque e entrega.",
        width: "10%",
    },
    {
        id: "markupPercentage",
        label: "Markup (%)",
        description: "Mostra o percentual de markup aplicado ao item.",
        width: "8%",
    },
    {
        id: "totalWithoutAdditions",
        label: "Total s/ somas",
        description: "Mostra o total do item sem os valores adicionais.",
        width: "10%",
    },
    {
        id: "unitPriceWithoutAdditions",
        label: "Valor unit s/ somas",
        description: "Mostra o valor unitário sem os valores adicionais.",
        width: "10%",
    },
    {
        id: "unitMarkup",
        label: "Markup unitário",
        description: "Mostra o valor de markup aplicado a cada unidade.",
        width: "10%",
    },
    {
        id: "totalMarkup",
        label: "Markup total",
        description: "Mostra o valor total de markup aplicado ao item.",
        width: "10%",
    },
    {
        id: "st",
        label: "ST",
        description: "Mostra o valor de substituição tributária do item.",
        width: "10%",
    },
    {
        id: "ipiPercentage",
        label: "IPI (%)",
        description: "Mostra o percentual de IPI aplicado ao item.",
        width: "10%",
    },
    {
        id: "ipiValue",
        label: "Valor IPI",
        description: "Mostra o valor calculado de IPI para o item.",
        width: "10%",
    },
    {
        id: "purchaseShipping",
        label: "Frete de compra",
        description: "Mostra o valor do frete de compra do item.",
        width: "10%",
    },
    {
        id: "extraValue",
        label: "Valor extra",
        description: "Mostra o valor adicional informado para o item.",
        width: "10%",
    },
    {
        id: "totalWithIpiAndSt",
        label: "Valor Total + IPI + ST",
        description: "Mostra o total do item incluindo IPI e substituição tributária.",
        width: "10%",
    },
] as const satisfies readonly {
    id: BudgetTableColumn;
    label: string;
    description: string;
    width: string;
}[];

export const defaultSimpleModeVisibleColumns: BudgetTableColumn[] = [
    "description",
    "internalCode",
    "unitPrice",
    "quantity",
    "totalWithAdditions",
    "shippingAndDelivery",
    "markupPercentage",
];
