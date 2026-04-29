import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { fakeClients } from "../test/fakeClients.js";

export const createFakeData = (db: Database) => {
    if (!isDev) return;

    const repo = createRepositories(db);

    fakeItens.forEach(item => {
        repo.item.createReference(item);
    });

    fakeClients.forEach(client => {
        repo.client.create(client);
    });
}