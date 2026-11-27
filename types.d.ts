// --------------- utils ---------------
declare const __APP_VERSION__: string;

type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------

/** Dados da cotação aceitos na criação. O status é opcional e inicia como rascunho. */
type CreateQuotationData = Pick<Quotation, "notes" | "amount" | "total_value" | "status">;

/** dados da cotação aceitos na criação. */
interface CreateQuotation {
    quotation: CreateQuotationData;
    items: {
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

/** dados da cotação aceitos na atualização. */
type UpdateQuotationData = Required<Omit<Quotation, "notes" | "created_at" | "updated_at">> & Quotation

/** dados da cotação completa esperados na atualização */
interface UpdateQuotation {
    quotation: UpdateQuotationData;
    items: {
        quotation_link_id?: QuotationLink['id'];
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- Item-API ---------------
type GetReferenceLinks = ReferenceLink['item_reference_id'];

type GetByReferenceId = ItemValues['item_reference_id'];

type SearchItemDescription = Pick<ItemReference, "description">['description'];

type SearchItemReferenceFields = {
    description?: string;
    internal_code?: string;
    manufacturer_code?: string;
};

type SearchItemReferenceQuery = SearchItemDescription | SearchItemReferenceFields;

type SearchItemDescriptionIsOptional = SearchItemDescription | undefined;

type AddToQuotationPayload = {
    quotation: {
        id: Quotation['id'];
        amount: Quotation['amount'];
        total_value: Quotation['total_value'];
    }
    items: {
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- channels and API ---------------
type EventPayloadMapping = {
    // quotation
    "quotation:create": Result<QuotationLink[] | undefined>;
    "quotation:getAllSummary": Result<Quotation[] | undefined>;
    "quotation:getFull": Result<QuotationFull | undefined>;
    "quotation:getByItemValuesId": Result<QuotationFull>;
    "quotation:update": Result<QuotationFull | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
    "item:getReferenceLinks": Result<ReferenceLink[] | undefined>;
    "item:findItemReferences": Result<ItemReference[] | undefined>;
    "item:getAllValuesByReferenceId": Result<ItemValues[] | undefined>;
    "item:getValuesById": Result<ItemValues>;
    "item:getDetailsByReferenceId": Result<ItemDetails | undefined>;
    "item:updateReference": Result<ItemWithReferenceLinks | undefined>;

    // janela (frame personalizado)
    "window:minimize": void;
    "window:maximizeToggle": void;
    "window:close": void;

    // application updates
    "update:getState": AppUpdateState;
    "update:download": void;
    "update:install": void;

    // application news
    "news:getState": ChangeLogState;
    "news:markRead": void;

    // application settings
    "settings:get": AppSettings;
    "settings:update": AppSettings;

    // custom margins
    "margins:get": CustomMargin[];
    "margins:add": CustomMargin[];
    "margins:remove": CustomMargin[];
}

type CustomMargin = {
    id: string;
    name: string;
    percentage: number;
};

type NewCustomMargin = Omit<CustomMargin, "id">;

type BudgetTableColumn =
    | "description"
    | "internalCode"
    | "unitPrice"
    | "quantity"
    | "totalWithAdditions"
    | "shippingAndDelivery"
    | "markupPercentage"
    | "totalWithoutAdditions"
    | "unitPriceWithoutAdditions"
    | "unitMarkup"
    | "totalMarkup"
    | "st"
    | "ipiPercentage"
    | "ipiValue"
    | "purchaseShipping"
    | "extraValue"
    | "totalWithIpiAndSt";

type ItemReferenceSimpleField =
    | "internalCode"
    | "manufacturerCode"
    | "ncm"
    | "notes"
    | "links";
type ItemValuesSimpleField =
    | "historyPrice"
    | "ipi"
    | "st"
    | "extraValue"
    | "discount"
    | "boarding"
    | "delivery"
    | "purchaseShipping"
    | "totalWithoutTaxes"
    | "markupValue"
    | "ipiValue"
    | "stValue"
    | "totalWithIPIandST"
    | "totalWithAll"
    | "finalUnitValue";

type BoardingInputMode = "calendarDays" | "businessDays" | "date";

type AppSettings = {
    version: 9;
    general: {
        automaticUpdates: boolean;
    };
    appearance: {
        colorScheme: AppColorScheme;
    };
    interface: {
        budgetTable: {
            defaultSimpleMode: boolean;
            defaultTagEditingEnabled: boolean;
            defaultQuotationStatus: QuotationStatus;
            simpleModeVisibleColumns: BudgetTableColumn[];
        };
        itemForm: {
            itemReference: {
                defaultSimpleMode: boolean;
                simpleModeVisibleFields: ItemReferenceSimpleField[];
            };
            itemValues: {
                defaultSimpleMode: boolean;
                simpleModeVisibleFields: ItemValuesSimpleField[];
                defaultMarkup: number;
                defaultBoarding: number;
                defaultBoardingMode: BoardingInputMode;
                defaultDelivery: number;
            };
        };
    };
};

type AppColorScheme = "auto" | "light" | "dark";

type SettingsUpdate = {
    general?: {
        automaticUpdates?: boolean;
    };
    appearance?: {
        colorScheme?: AppColorScheme;
    };
    interface?: {
        budgetTable?: {
            defaultSimpleMode?: boolean;
            defaultTagEditingEnabled?: boolean;
            defaultQuotationStatus?: QuotationStatus;
            simpleModeVisibleColumns?: BudgetTableColumn[];
        };
        itemForm?: {
            itemReference?: {
                defaultSimpleMode?: boolean;
                simpleModeVisibleFields?: ItemReferenceSimpleField[];
            };
            itemValues?: {
                defaultSimpleMode?: boolean;
                simpleModeVisibleFields?: ItemValuesSimpleField[];
                defaultMarkup?: number;
                defaultBoarding?: number;
                defaultBoardingMode?: BoardingInputMode;
                defaultDelivery?: number;
            };
        };
    };
};

type ChangeLogState = {
    version: string;
    unread: boolean;
};

type AppUpdateStatus =
    | "idle"
    | "unsupported"
    | "checking"
    | "not-available"
    | "available"
    | "downloading"
    | "downloaded"
    | "preparing"
    | "installing"
    | "finalizing"
    | "error";

type AppUpdateState = {
    status: AppUpdateStatus;
    version?: string;
    percent?: number;
    error?: string;
    automatic?: boolean;
};

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
    getAllSummary(query?: string): Promise<Result<Quotation[] | undefined>>;
    getFull(quotationId: Quotation['id']): Promise<Result<QuotationFull | undefined>>;
    getByItemValuesId(itemValuesId: ItemValues["id"]): Promise<Result<QuotationFull>>;
    update(quotation: UpdateQuotation): Promise<Result<QuotationFull | undefined>>;
}

interface ItemAPI {
    searchDescription(query: SearchItemReferenceQuery): Promise<Result<ItemReference[] | undefined>>;
    findItemReferences(description: SearchItemDescriptionIsOptional): Promise<Result<ItemReference[] | undefined>>;
    getReferenceLinks(itemReferenceId: GetReferenceLinks): Promise<Result<ReferenceLink[] | undefined>>;
    getAllValuesByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemValues[] | undefined>>;
    getValuesById(itemValuesId: ItemValues["id"]): Promise<Result<ItemValues>>;
    getDetailsByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemDetails | undefined>>;
    updateReference(payload: UpdateItemReferencePayload): Promise<Result<ItemWithReferenceLinks | undefined>>;
}

interface WindowAPI {
    minimize(): Promise<void>;
    maximizeToggle(): Promise<void>;
    close(): Promise<void>;
}

interface AppUpdateAPI {
    getState(): Promise<AppUpdateState>;
    onStateChange(callback: (state: AppUpdateState) => void): () => void;
    download(): Promise<void>;
    install(): Promise<void>;
}

interface NewsAPI {
    getState(): Promise<ChangeLogState>;
    markRead(): Promise<void>;
}

interface SettingsAPI {
    get(): Promise<AppSettings>;
    update(settings: SettingsUpdate): Promise<AppSettings>;
}

interface MarginsAPI {
    get(): Promise<CustomMargin[]>;
    add(margin: NewCustomMargin): Promise<CustomMargin[]>;
    remove(id: string): Promise<CustomMargin[]>;
}

interface API {
    quotation: QuotationAPI;
    item: ItemAPI;
    window: WindowAPI;
    updates: AppUpdateAPI;
    news: NewsAPI;
    settings: SettingsAPI;
    margins: MarginsAPI;
};

interface Window {
    api: API;
};