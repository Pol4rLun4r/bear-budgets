interface QuotationStatusOption {
    value: QuotationStatus;
    label: string;
    color: "gray" | "green" | "yellow" | "red";
}

export const quotationStatusOptions: Record<QuotationStatus, QuotationStatusOption> = {
    0: { value: 0, label: "Rascunho", color: "gray" },
    1: { value: 1, label: "Concluído", color: "green" },
    2: { value: 2, label: "Revisar", color: "yellow" },
    3: { value: 3, label: "Declinado", color: "red" },
};

export const getQuotationStatusOption = (status?: QuotationStatus) =>
    quotationStatusOptions[status ?? 0];
