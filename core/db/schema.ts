// Tipos do domínio / banco (schema aplicado via migrations em ./migrate.ts)

// Cotação "container" – agrupa todas as versões. Imutável (não se edita, só se adicionam versões).
export type QuotationType = {
    id: number;
    client_id: number;
    created_at: string;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
export type QuotationStatus = 0 | 1 | 2;

// Uma versão imutável de uma cotação. "Editar" = criar nova versão. 
export type QuotationVersionType = {
    id: number;
    quotation_id: number;
    version: number;
    status: QuotationStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

// status: 0 = draft, 1 = approved, 2 = omie