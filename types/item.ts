// referência do item – dados mestres (descrição, código, NCM). Criada uma vez
export type ItemReferenceType = {
    id: number;
    description: string;
    internal_code: string | null;
    manufacturer_code: string | null;
    ncm: string | null;
    created_at: string;
    updated_at: string;
};

// nota ligada à referência do item (texto livre ou link)
export type ItemReferenceNoteInput = {
    type: "text" | "link";
    content: string;
};

// nota da referência como retornada do banco
export type ItemReferenceNoteType = {
    id: number;
    item_reference_id: number;
    type: "text" | "link";
    content: string;
    created_at: string;
    updated_at: string;
};

// referência do item com suas notas (retorno do get por id)
export type ItemReferenceWithNotesType = ItemReferenceType & {
    notes: ItemReferenceNoteType[];
};

// uma versão imutável do item (ex.: versão 1 ao criar; novas versões ao editar)
export type ItemVersionType = {
    id: number;
    item_reference_id: number;
    version: number;
    quantity: number;
    unit_price: number | null;
    markup: number | null;
    purchase_freight: number | null;
    ipi: number | null;
    st: number | null;
    created_at: string;
    updated_at: string;
};

// vínculo entre uma versão da cotação e uma versão do item
// usado para buscar ou edições futuras do item
export type QuotationVersionItemType = {
    id: number;
    quotation_version_id: number;
    item_version_id: number;
    created_at: string;
};

// payload para adicionar um item à cotação (cria referência + versão 1 + link)
export type AddItemToQuotationInput = {
    description: string;
    internal_code?: string | null;
    manufacturer_code?: string | null;
    ncm?: string | null;
    quantity?: number;
    unit_price?: number | null;
    markup?: number | null;
    purchase_freight?: number | null;
    ipi?: number | null;
    st?: number | null;
    // Notas da referência já no momento da criação do item
    notes?: ItemReferenceNoteInput[];
};

// resultado de um item adicionado (referência, versão e link criados)
export type AddedItemResult = {
    item_reference_id: number;
    item_version_id: number;
    quotation_version_item_id: number;
};
