// Tipos do domínio / banco (schema aplicado via migrations em ./migrate.ts)

import { QuotationStatus } from "../../types/quotation";

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