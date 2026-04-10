import type { Client } from "./client";
import type { ItemNote, ItemReference, ItemVersion } from "./item";

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

export type QuotationVersionSummary = {
    quotation_id: number;
    quotation_version_id: number;
    client_id: number;
    client_name: string;
    client_document: string;
    version: number;
    status: QuotationStatus;
    notes: string | null;
};

export type QuotationVersionAllData = {
    quotation: {
        quotation_id: number;
        quotation_version_id: number;
        notes?: string;
        status?: QuotationStatus;
    }
    client: Client;
    items: {
        item_reference: ItemReference;
        item_version: ItemVersion;
        item_notes: ItemNote[]
    }[]
}