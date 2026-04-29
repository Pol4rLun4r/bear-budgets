/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";
import { normalizeDocument, onlyName } from "../../../../utils/clean.js";

const itemsPayload: CreateWithAllData['items'] = [
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
]


describe("Part 1 success create client - Create Quotation and Add Items", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
    })

    const expectCreateClient = (payload: CreateWithAllData) => {
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        }

        const quotationLinks = response.data;

        // 3. verifica o resultado
        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

            // verifica se o cliente foi criado e se é o mesmo em cada "quotation_link" 
            const resQuotationVersionId = quotation_link.quotation_version_id; // pega o id de quotation version
            const resQuotationVersionData = repo.quotation.getByVersionId(resQuotationVersionId); // pega os dados de quotation version 
            const resClientId = resQuotationVersionData?.client_id; // pega os id do cliente
            const resClientData = repo.client.getById(resClientId); // pega os dados do cliente

            // 3.1 verifica se o nome do cliente é o mesmo informado
            expect(resClientData?.name).toBe(onlyName(payload.client.name));

            // 3.2 verifica se o documento do cliente é o mesmo informado
            expect(resClientData?.document).toBe(normalizeDocument(payload.client.document));

            // 3.3 verifica se as notas do cliente é a mesma informada
            expect(resClientData?.notes === null ? undefined : resClientData?.notes).toBe(payload.client.notes);

            // 3.4 verifica se o typo de cliente é o mesmo informado
            expect(resClientData?.type_client).toBe(payload.client.type_client);
        }
    }

    it("ter sucesso ao criar um novo cliente com notas", async () => {
        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: fakeClients[0],
            items: itemsPayload,
            quotation: { notes: "Hello world" } as any
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });

    it("ter sucesso ao usar um cliente que já existe", async () => {

        // 1. prepara o payload
        const clientId = repo.client.create({ ...fakeClients[0] } as any)?.id;

        const payload: CreateWithAllData = {
            client: { id: clientId } as any,
            items: itemsPayload,
            quotation: { notes: "Hello world" } as any
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });

    it("ter sucesso ao criar um cliente que já existe", async () => {

        // 1. prepara o payload
        repo.client.create({ ...fakeClients[0] });

        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: itemsPayload,
            quotation: { notes: "Hello world" } as any
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });
});
