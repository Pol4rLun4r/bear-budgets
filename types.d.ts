// --------------- utils ---------------
type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------
interface CreateQuotation extends Partial<Pick<Quotation, "client_id">>, Pick<QuotationVersion, "notes" | "status" | 'total_value' | 'amount'> { }

interface CreateWithAllData {
    client: Client;
    quotation: CreateQuotation;
    items: {
        item_reference: Partial<ItemReference>;
        item_version: Partial<ItemVersion>;
        notes: Partial<ItemNote>[];
    }[];
};

// --------------- Item-API ---------------
type GetItemNotes = ItemNote['item_reference_id'];

type CreateItemNote = Omit<ItemNote, "id" | "created_at" | "updated_at">;

type SearchItemDescription = Pick<ItemReference, "description">['description'];

// --------------- Client-API ---------------
interface SearchClient {
    value: string;
    type: 'document' | 'name';
}

// --------------- channels and API ---------------
type EventPayloadMapping = {
    // client
    "client:create": Result<Client | undefined>;
    "client:search": Result<Client[] | undefined>;

    // quotation
    "quotation:create": Result<QuotationSummary | undefined>;
    "quotation:createWithItems": Result<QuotationLink[] | undefined>;
    "quotation:getAllSummary": Result<QuotationSummary[] | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
    "item:getNotes": Result<ItemNote[] | undefined>;
    "item:createNote": Result<ItemNote['item_reference_id'] | undefined>;
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

interface ClientAPI {
    create(client: Client): Promise<Result<Client | undefined>>;
    search(query: SearchClient): Promise<Result<Client[] | undefined>>;
};

interface QuotationAPI {
    create(quotation: CreateQuotation): Promise<Result<QuotationSummary | undefined>>;
    createWithItems(quotation: CreateWithAllData): Promise<Result<QuotationLink[] | undefined>>;
    getAllSummary(): Promise<Result<QuotationSummary[] | undefined>>;
}

interface ItemAPI {
    searchDescription(description: SearchItemDescription): Promise<Result<ItemReference[] | undefined>>;
    getNotes(itemReferenceId: GetItemNotes): Promise<Result<ItemNote[] | undefined>>;
    createNote(note: CreateItemNote): Promise<Result<ItemNote['item_reference_id'] | undefined>>;
}

interface API {
    client: ClientAPI;
    quotation: QuotationAPI;
    item: ItemAPI;
};

interface Window {
    api: API;
};