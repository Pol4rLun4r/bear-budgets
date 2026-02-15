export type TypeClientCategory = "nacional" | "internacional";

export type ClientType = {
    id: number;
    name?: string;
    document?: string;
    type_client?: TypeClientCategory;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type ClientQuery = Omit<
    ClientType,
    "id" | "created_at" | "updated_at"
>;