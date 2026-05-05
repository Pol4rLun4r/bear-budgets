// --------------- Client ---------------

// tipo de cliente (padrão nacional)
type ClientType = "nacional" | "internacional";

// dados do cliente
type Client = {
    id?: number;
    name: string;
    document: string;
    type_client: ClientType;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// --------------- Quotation ---------------

// versão container da cotação
type Quotation = {
    id?: number;
    client_id: number;
    created_at?: string;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
type QuotationStatus = 0 | 1 | 2;

// versão que carrega variações da cotação
type QuotationVersion = {
    id?: number;
    quotation_id: number;
    version: number;
    status: QuotationStatus | undefined;
    notes?: string;
    total_value: number;
    amount: number;
    created_at?: string;
    updated_at?: string;
};

// versão resumida da cotação para listagem
type QuotationSummary = {
    quotation_id: number;
    quotation_version_id: number;
    client_id: number;
    client_name: string;
    client_document: string;
    version: number;
    status: QuotationStatus;
    notes: string | null;
    total_value: number;
    amount: number;
};

// apenas os valores do ItemVersion, utilitário para a cotação com dados resumido
type SummaryValues = Pick<ItemVersion, 'quantity' | 'unit_price' | 'markup' | 'ipi' | 'st' | 'purchase_shipping'>;

// cotações feitas com dados resumidos, dados da cotação, do cliente e valores dos itens
type QuotationWithSummaryData = {
    client: Client;
    quotation_version: QuotationVersion
    values: SummaryValues[]
};

// --------------- Item ---------------

// referência do item – dados mestres (descrição, código, NCM). Criada uma vez
type ItemReference = {
    id?: number;
    description: string;
    internal_code?: string;
    manufacturer_code?: string;
    ncm?: string;
    created_at?: string;
    updated_at?: string;
};

type ItemNoteType = "text" | "link";

// nota da referência como retornada do banco
type ItemNote = {
    id?: number;
    item_reference_id: number;
    type: ItemNoteType;
    content: string;
    created_at?: string;
    updated_at?: string;
};

// valores do item – dados mutáveis (preço, quantidade, etc). Criada a cada edição.
type ItemVersion = {
    id?: number;
    item_reference_id: number;
    position: number; // posição do item na cotação (ordem)
    version: number;
    quantity: number;
    unit_price?: number;
    markup?: string;
    purchase_shipping?: number;
    ipi?: number;
    st?: number;
    created_at?: string;
    updated_at?: string;
};

type ItemWithNotes = ItemReference & {
    notes: ItemNote[];
};

type ItemData = {
    item_reference: ItemReference;
    item_version: ItemVersion;
    notes: ItemNote[];
};

type QuotationLink = {
    id?: number;
    quotation_version_id: number;
    item_reference_id: number;
    item_version_id: number;
    created_at?: string;
};