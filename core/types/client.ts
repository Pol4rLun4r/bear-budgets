export type ClientType = "nacional" | "internacional";

export type Client = {
    id: number;
    name?: string;
    document?: string;
    type_client?: ClientType;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type ClientQuery = Omit<
    Client,
    "id" | "created_at" | "updated_at"
>;