/// <reference types="vitest/globals" />

// types
import type { QuotationPayload } from "../../../services/createQuotationWithItems.service";
import { AddedItemResult } from "../../../types/item";

// utils
import { fakeItens } from "../fakeItens";

// repo
import { createRepositories } from "../../../repositories";

// test
import { createTestApp } from "../../../utils/createTestApp";

// api
import request from "supertest";

describe("POST /quotations/items - Create Quotation and Add Items - Part 2 success create quotation", () => {

    it("ter sucesso ao criar uma nova cotação com notas e status", async () => {
        const { app, db } = createTestApp();
        const repo = createRepositories(db);

        // 1. prepara o payload
        const payload: QuotationPayload = {
            client: {
                name: "polaroid san",
                document: "2003 9966054",
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
            quotation: { notes: "nova cotação", status: 2 } as any
        }

        // 2. envia a requisição
        const res = await request(app)

            .post("/quotations/items")
            .send(payload)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        const responseLink = await res.body.data as AddedItemResult[]

        const sameQuotationVersionId = responseLink[0].quotation_version_id; // o id de quotation_version_id deve ser o mesmo para todos os quotation_link, no caso o primeiro link tem o mesmo quotation_version_id dos demais

        for (let index = 0; index < responseLink.length; index++) {
            const quotation_link = responseLink[index];

            // verifica se o orçamento foi criado e se é o mesmo em cada "quotation_link" 
            const resQuotationVersionId = quotation_link.quotation_version_id; // pega o id de quotation version
            const resQuotationVersionData = repo.quotation.getByVersionId(resQuotationVersionId); // pega os dados de quotation version

            // 3.1 verifica se o id da cotação é o mesmo para todos os "quotation_link"
            expect(resQuotationVersionId).toBe(sameQuotationVersionId);

            // 3.2 verifica se as notas da cotação é a mesma informada
            expect(resQuotationVersionData?.notes).toBe(payload.quotation.notes);

            // 3.3 verifica se o status é o mesmo informado
            expect(resQuotationVersionData?.status).toBe(payload.quotation.status);
        }
    });
});
