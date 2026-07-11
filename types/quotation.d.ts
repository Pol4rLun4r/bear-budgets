// --------------- Quotation ---------------

// cotação
type Quotation = {
    id?: number;
    status?: QuotationStatus | undefined;
    notes?: string;
    total_value: number;
    amount: number;
    created_at?: string;
    updated_at?: string;
};

// Status por versão: 0 = rascunho, 1 = enviado
type QuotationStatus = 0 | 1;
// --------------- Item ---------------

// referência do item – dados mestres (descrição, código, NCM). Criada uma vez
type ItemReference = {
    id?: number;
    description: string;
    internal_code?: string;
    manufacturer_code?: string;
    ncm?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
};

type ReferenceLink = {
    id?: number;
    item_reference_id: number;
    content: string;
    created_at?: string;
}

// valores do item – dados mutáveis (preço, quantidade, etc)
type ItemValues = {
    id?: number;
    item_reference_id: number;
    position: number; // posição do item na cotação (ordem)
    version: number;
    quantity: number;
    unit_price?: number;
    markup?: number;
    purchase_shipping?: number;
    ipi?: number;
    st?: number;
    extra_value?: number;
    boarding?: string;
    created_at?: string;
    updated_at?: string;
};

type ItemWithReferenceLinks = ItemReference & {
    reference_links: ReferenceLink[];
};

type ItemData = {
    item_reference: ItemReference;
    item_values: ItemValues;
    reference_links: ReferenceLink[];
};

type QuotationLink = {
    id?: number;
    quotation_id: number;
    item_reference_id: number;
    item_values_id: number;
    created_at?: string;
    updated_at?: string;
};

/** Uma linha da cotação completa: vínculo + snapshot do item na última versão. */
type QuotationDetailLine = {
    quotation_link_id: number;
    item_reference: ItemReference;
    item_values: ItemValues;
    reference_links: ReferenceLink[];
};

/** Cotação completa para a tela “ver detalhes”: pai, cliente, última revisão e itens via quotation_links. */
type QuotationFullDetail = {
    quotation: Quotation;
    client: Client;
    items: QuotationDetailLine[];
};