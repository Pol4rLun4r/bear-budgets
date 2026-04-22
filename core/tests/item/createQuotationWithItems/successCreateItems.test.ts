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

describe("POST /quotations/items - Create Quotation and Add Items - Part 3 success create items", () => {

    it("ter sucesso ao criar items com e sem notas e valores", async () => {
        const { app, db } = createTestApp();
        const repo = createRepositories(db);

        // 1. prepara o payload
        const payload: QuotationPayload = {
            client: {
                name: "kale industrias",
                document: "95.351.317/0001-89",
                notes: "novo cliente",
                type_client: "nacional"
            },
            items: [
                {
                    position: 0,
                    item_basic_data: { ...fakeItens[0] },
                    notes: [],
                    values: {
                        quantity: 2,
                        unit_price: 2,
                        ipi: 1.3
                    }
                },
                {
                    position: 2,
                    item_basic_data: { ...fakeItens[1] },
                    notes: [
                        { type: "link", content: '312' }
                    ],
                    values: {
                        quantity: 2,
                        unit_price: 2,
                        markup: "40.1"
                    }
                },
                {
                    position: 3,
                    item_basic_data: { ...fakeItens[2] },
                    notes: [
                        { type: "link", content: 'https://nota1.com' },
                        { type: "text", content: 'nota 2' }
                    ],
                    values: {
                        quantity: 2,
                        unit_price: 2,
                        purchase_shipping: 31,
                        st: 43
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

        for (let index = 0; index < responseLink.length; index++) {
            const quotation_link = responseLink[index];

            // verifica se os itens foram criados
            const itemReferenceData = repo.item.getReferenceById(quotation_link.item_reference_id);
            const itemVersionData = repo.item.getVersionById(quotation_link.item_version_id);

            // 3.1 verifica se a descrição do item é o mesmo informado
            expect(itemReferenceData?.description).toBe(payload.items[index].item_basic_data.description);

            // 3.2 verifica se o código interno é o mesmo informado
            expect(itemReferenceData?.internal_code).toBe(payload.items[index].item_basic_data.internal_code);

            // 3.3 verifica se o código do fabricante é o mesmo informado
            expect(itemReferenceData?.manufacturer_code).toBe(payload.items[index].item_basic_data.manufacturer_code);

            // 3.4 verifica se o ncm é o mesmo informado
            expect(itemReferenceData?.ncm).toBe(payload.items[index].item_basic_data.ncm);

            // verifica as notas do item
            if (itemReferenceData?.notes) {
                for (let noteIndex = 0; noteIndex < itemReferenceData?.notes.length; noteIndex++) {
                    const note = itemReferenceData?.notes[noteIndex];

                    // 3.5 verifica se o conteúdo da nota é a mesma informada
                    expect(note.content).toBe(payload.items[index].notes[noteIndex].content);

                    // 3.6 verifica se o tipo da nota é a mesma informada
                    expect(note.type).toBe(payload.items[index].notes[noteIndex].type);
                }
            }

            //verifica os valores do item criado

            // 3.7 verifica se a posição é a mesma informada
            expect(itemVersionData?.position).toBe(payload.items[index].position);

            // 3.8 verifica se a quantidade é a mesma informada
            expect(itemVersionData?.quantity).toBe(payload.items[index].values.quantity);

            // 3.9 verifica se o preço unitário é o mesmo informado
            expect(itemVersionData?.unit_price).toBe(payload.items[index].values.unit_price);

            // 3.10 verifica se o markup é o mesmo informado
            if (payload.items[index].values.markup !== null && payload.items[index].values.markup !== undefined) {
                expect(itemVersionData?.markup).toBe(payload.items[index].values.markup);
            } else {
                expect(itemVersionData?.markup).toBe(null);
            }

            // 3.11 verifica se o frete de compra é o mesmo informado
            if (payload.items[index].values.purchase_shipping !== null && payload.items[index].values.purchase_shipping !== undefined) {
                expect(itemVersionData?.purchase_shipping).toBe(payload.items[index].values.purchase_shipping);
            } else {
                expect(itemVersionData?.purchase_shipping).toBe(null);
            }

            // 3.12 verifica se o ipi é o mesmo informado
            if (payload.items[index].values.ipi !== null && payload.items[index].values.ipi !== undefined) {
                expect(itemVersionData?.ipi).toBe(payload.items[index].values.ipi);
            } else {
                expect(itemVersionData?.ipi).toBe(null);
            }

            // 3.13 verifica se o st é o mesmo informado
            if (payload.items[index].values.st !== null && payload.items[index].values.st !== undefined) {
                expect(itemVersionData?.st).toBe(payload.items[index].values.st);
            } else {
                expect(itemVersionData?.st).toBe(null);
            }
        }
    });
});
