import { createDatabase } from "../db/connection";
import { createApp } from "../app";

import { PORT, DB_PATH } from "../config/env";

import { fakeClients } from "../tests/client/fakeClients";
import { fakeItens } from "../tests/item/fakeItens";
import { createRepositories } from "../repositories";

const db = createDatabase(DB_PATH);
const app = createApp(db);

// create fake clients and itens
const repo = createRepositories(db);

fakeClients.map(client => {
    repo.client.create(client);
})

// Notas de referência fake (ao menos 2 por item)
const fakeNotePairs: Array<{ type: "text" | "link"; content: string }[]> = [
    [
        { type: "text", content: "Especificação técnica conforme norma NBR 7286." },
        { type: "link", content: "https://exemplo.com/ficha-cabo-2-5mm" },
    ],
    [
        { type: "text", content: "Verificar estoque mínimo antes do pedido." },
        { type: "link", content: "https://exemplo.com/catalogo-cabos" },
    ],
];

fakeItens.map((item, index) => {
    const ItemWrapper = {item_basic_data: item} 
    const itemReferenceId = repo.item.createReference(ItemWrapper as any);
    const notes = fakeNotePairs[index % fakeNotePairs.length];
    notes.forEach((note) => {
        repo.item.createNoteReference(itemReferenceId, note);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});