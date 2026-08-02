// --------------- utils ---------------
type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------

/** Dados da cotação aceitos na criação. `status` é definido pelo backend (sempre rascunho). */
type CreateQuotationData = Pick<Quotation, "notes" | "amount" | "total_value">;

type UpdateQuotationLinePayload = {
    quotation_link_id: QuotationLink['id'];
    item_reference: Partial<ItemReference>;
    item_values: Partial<ItemValues>;
    reference_links: Partial<ReferenceLink>[];
}

interface CreateQuotation {
    quotation: CreateQuotationData;
    items: {
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- Item-API ---------------
type GetReferenceLinks = ReferenceLink['item_reference_id'];

type GetByReferenceId = ItemValues['item_reference_id'];

type SearchItemDescription = Pick<ItemReference, "description">['description'];

type SearchItemDescriptionIsOptional = SearchItemDescription | undefined;


// --------------- channels and API ---------------
type EventPayloadMapping = {
    // quotation
    "quotation:create": Result<QuotationLink[] | undefined>;
    "quotation:getAllSummary": Result<Quotation[] | undefined>;
    "quotation:getFull": Result<QuotationFull | undefined>;
    "quotation:updateLine": Result<UpdateQuotationLinePayload | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
    "item:getReferenceLinks": Result<ReferenceLink[] | undefined>;
    "item:findItemReferences": Result<ItemReference[] | undefined>;
    "item:getAllValuesByReferenceId": Result<ItemValues[] | undefined>;

    // janela (frame personalizado)
    "window:minimize": void;
    "window:maximizeToggle": void;
    "window:close": void;
}

// --------------- API ---------------
type SuccessResponse<T> = {
    success: true;
    data: T;
    code?: string;
};
type FailureResponse = {
    success: false;
    data: string;
    code?: string;
};

type Result<T> = FailureResponse | SuccessResponse<T>;

interface QuotationAPI {
    create(quotation: CreateQuotation): Promise<Result<QuotationLink[] | undefined>>;
    getAllSummary(): Promise<Result<QuotationSummary[] | undefined>>;
    getFull(quotationId: Quotation['id']): Promise<Result<QuotationFull | undefined>>;
    updateLine(payload: UpdateQuotationLinePayload): Promise<Result<UpdateQuotationLinePayload | undefined>>;
}

interface ItemAPI {
    searchDescription(description: SearchItemDescription): Promise<Result<ItemReference[] | undefined>>;
    findItemReferences(description: SearchItemDescriptionIsOptional): Promise<Result<ItemReference[] | undefined>>;
    getReferenceLinks(itemReferenceId: GetReferenceLinks): Promise<Result<ReferenceLink[] | undefined>>;
    getAllValuesByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemValues[] | undefined>>;
}

interface WindowAPI {
    minimize(): Promise<void>;
    maximizeToggle(): Promise<void>;
    close(): Promise<void>;
}

interface API {
    quotation: QuotationAPI;
    item: ItemAPI;
    window: WindowAPI;
};

interface Window {
    api: API;
};