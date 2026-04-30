import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { fakeClients } from "../test/fakeClients.js";

export const createFakeData = (db: Database) => {
    if (!isDev) return;

    // Notas de referência fake (ao menos 2 por item)
    const fakeNotePairs = [
        [
            { type: "text", content: "Especificação técnica conforme norma NBR 7286." },
            { type: "link", content: "https://exemplo.com/ficha-cabo-2-5mm" },
        ],
        [
            { type: "text", content: "Verificar estoque mínimo antes do pedido." },
            { type: "link", content: "https://exemplo.com/catalogo-cabos" },
        ],
    ];

    const repo = createRepositories(db);

    fakeItens.forEach((item, index) => {
        const itemReferenceId = repo.item.createReference(item);
        const notes = fakeNotePairs[index % fakeNotePairs.length];
        notes.forEach((note) => {
            repo.item.createNote(itemReferenceId, {...note} as ItemNote);
        });
    });

    fakeClients.forEach(client => {
        repo.client.create(client);
    });
}