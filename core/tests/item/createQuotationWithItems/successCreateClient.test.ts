/// <reference types="vitest/globals" />

// types
import type { QuotationPayload } from "../../../services/createQuotationWithItems.service";
import { AddedItemResult } from "../../../types/item";

// utils
import { fakeItens } from "../fakeItens";
import { normalizeDocument, onlyName } from "../../../utils/clean";

// repo
import { createRepositories } from "../../../repositories";

// test
import { createTestApp } from "../../../utils/createTestApp";

// api
import request from "supertest";

describe("POST /quotations/items - Create Quotation and Add Items - Part 1 success create client", () => {

    it("ter sucesso ao criar um novo cliente com notas", async () => {
        const { app, db } = createTestApp();
        const repo = createRepositories(db);

        // 1. prepara o payload
        const payload: QuotationPayload = {
            client: {
                name: "Marcus LTDA",
                document: "53.548.3530001-97",
                notes: "novo cliente",
                type_client: "nacional"
            },
            items: [
                {
                    position: 1,
                    item_basic_data: { ...fakeItens[0] },
                    notes: [],
                    values: {
                        quantity: 2,
                        unit_price: 2
                    }
                },
                {
                    position: 2,
                    item_basic_data: { ...fakeItens[0] },
                    notes: [
                        { type: "link", content: '312' }
                    ],
                    values: {
                        quantity: 2,
                        unit_price: 2
                    }
                }
            ],
            quotation: { notes: "Hello world" } as any
        }

        // 2. envia a requisição
        const res = await request(app)

            .post("/quotations/items")
            .send(payload)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        const responseLink = await res.body.data as AddedItemResult[]

        for (let index = 0; index < responseLink.length; index++) {
            const quotation_link = responseLink[index];

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
            expect(resClientData?.notes).toBe(payload.client.notes);

            // 3.4 verifica se o typo de cliente é o mesmo informado
            expect(resClientData?.type_client).toBe(payload.client.type_client);
        }
    });
});
