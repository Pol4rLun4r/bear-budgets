// types
import type { Database } from "better-sqlite3";
import type { ClientType } from "../db/schema";

// utils
import { onlyNumbers, onlyName } from "../utils/clean";

export type ClientQuery = Omit<
    ClientType,
    "id" | "created_at" | "updated_at"
>;

export const createClientRepository = (db: Database) => ({ ...data }: ClientQuery) => {
    const document = onlyNumbers(data.document!)
    const name = onlyName(data.name!)

    const client = db.transaction(() => {

        // check or insert client
        const clientQuery = db.prepare(`
            INSERT INTO clients (name, document, type_client, notes)
            VALUES (?, ?, ?, ?) 
            `).run(name, document, data.type_client, data.notes);

        const clientId = clientQuery.lastInsertRowid;

        // get client by id
        const client = db.prepare(`
            SELECT *
            FROM clients
            WHERE id = ?
            LIMIT 1
        `).get(clientId) as ClientType | undefined;

        return client;
    });

    return client();
}

export const getClientByDocumentRepository = (db: Database) => (document: string | undefined) => {
    // get client document
    const client = db.prepare(`
        SELECT *
        FROM clients
        WHERE document = ?
        LIMIT 1
    `).get(document) as ClientType | undefined;

    return client;
}

export const getClientByIdRepository = (db: Database) => (id?: number) => {
    // get client by id
    const client = db.prepare(`
        SELECT *
        FROM clients
        WHERE id = ?
        LIMIT 1
    `).get(id) as ClientType | undefined;

    return client;
}

export const searchClientsByDocumentRepository = (db: Database) => (document: string | undefined) => {
    // get all clients by document
    const clients = db.prepare(`
        SELECT *
        FROM clients
        WHERE document LIKE ? || '%'
        ORDER by name
        LIMIT 10
    `).all(document) as ClientType[];

    return clients;
}

export const searchClientsByNameRepository = (db: Database) => (name: string | undefined) => {
    // get all clients by name
    const clients = db.prepare(`
        SELECT *
        FROM clients
        WHERE name LIKE ? || '%'
        ORDER by name
        LIMIT 10
    `).all(name) as ClientType[];

    return clients;
}