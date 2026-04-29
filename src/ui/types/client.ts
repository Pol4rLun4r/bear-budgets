export type TypeClient = "nacional" | "internacional";

export type Client = {
    id: number;
    name?: string;
    document?: string;
    type_client?: TypeClient;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type ClientQuery = Omit<
    Client,
    "id" | "created_at" | "updated_at"
> & {
    id?: number;
};