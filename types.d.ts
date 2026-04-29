// --------------- utils ---------------
type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------
interface CreateQuotation extends Pick<Quotation, "client_id">, Pick<QuotationVersion, "notes" | "status"> { }

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
interface SearchClient {
    value: string;
    type: 'document' | 'name';
}

type SearchItemDescription = Pick<ItemReference, "description">['description'];

// --------------- channels and API ---------------
type EventPayloadMapping = {
    // client
    "client:create": Result<Client | undefined>;
    "client:search": Result<Client[] | undefined>;

    // quotation
    "quotation:create": Result<QuotationVersionSummary | undefined>;
    "quotation:createWithItems": Result<QuotationLink[] | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
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
    create(quotation: CreateQuotation): Promise<Result<QuotationVersionSummary | undefined>>;
    createWithItems(quotation: CreateWithAllData): Promise<Result<QuotationLink[] | undefined>>;
}

interface ItemAPI {
    searchDescription(description: SearchItemDescription): Promise<Result<ItemReference[] | undefined>>;
}

interface API {
    client: ClientAPI;
    quotation: QuotationAPI;
    item: ItemAPI;
};

interface Window {
    api: API;
};