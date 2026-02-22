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

fakeItens.map(item => {
    repo.item.createReference(item);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});