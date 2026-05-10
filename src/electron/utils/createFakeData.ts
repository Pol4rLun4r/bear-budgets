import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { fakeClients } from "../test/fakeClients.js";
import { createServices } from "../services/index.js";

export const createFakeData = (db: Database) => {
    // cuidado: tem de ser isDev() com parênteses — escrever !isDev sem chamar é sempre truthy na função e eu estava a injectar fake na build de produção sem perceber
    if (!isDev()) return;

    const repo = createRepositories(db);
    const services = createServices(db);

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

    // Cria itens falsos
    fakeItens.forEach((item, index) => {
        const itemReferenceId = repo.item.createReference(item);
        const notes = fakeNotePairs[index % fakeNotePairs.length];
        notes.forEach((note) => {
            repo.item.createNote(itemReferenceId, { ...note } as ItemNote);
        });
    });

    // Cria clientes falsos
    fakeClients.forEach(client => {
        repo.client.create(client);
    });


    const payloadQuotation: CreateWithAllData = {
        client: { ...fakeClients[0] },
        items: [
            {
                item_reference: { ...fakeItens[0] },
                notes: [],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    position: 0
                }
            },
            {
                item_reference: { ...fakeItens[0] },
                notes: [
                    { type: "link", content: '312' }
                ],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    position: 1
                }
            }
        ],
        quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello World" }
    }

    // Cria falsos orçamentos
    for (let index = 0; index < 50; index++) {
        services.quotation.createWithItems(payloadQuotation);
    }
}