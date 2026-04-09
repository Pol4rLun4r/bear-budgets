// Cotação "container" – agrupa todas as versões. Imutável (não se edita, só se adicionam versões).
export type Quotation = {
    id: number;
    client_id: number;
    created_at: string;
};

export type QuotationQuery = Omit<
    Quotation,
    "id" | "created_at"
> & {
    notes?: string | null;
    status?: QuotationStatus;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
export type QuotationStatus = 0 | 1 | 2;