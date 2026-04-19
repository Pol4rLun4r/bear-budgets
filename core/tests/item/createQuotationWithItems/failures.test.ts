/// <reference types="vitest/globals" />

// api
import request from "supertest";

// utils
import { createTestApp } from "../../../utils/createTestApp";
import { fakeItens } from "../fakeItens";

// types 
import type { QuotationPayload } from "../../../services/createQuotationWithItems.service";

describe("POST /quotations/items - Create Quotation and Add Items", () => {
    const { app } = createTestApp();

    describe("Client", () => {
        // testes para verificar a criação ou uso do cliente

        it("falha ao criar um cliente para cotação, por ausência de nome", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "",
                    document: "34.904.031/0001-99",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Nome é obrigatório");
        });

        it("falha ao criar um cliente para cotação, por ausência de documento", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid",
                    document: "",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Documento é obrigatório");
        });

        it("falha ao criar um cliente para cotação, ao informar um documento inválido", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid",
                    document: "123",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Informe um documento válido");
        });

        it("falha ao criar um cliente para cotação, quando o tipo do cliente não é informado corretamente", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "aaaaaa" as any
                },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Por favor, especifique o tipo do cliente. Internacional ou Nacional");
        });
    });

    describe("Quotation", () => {
        // teste para verificar a criação da cotação

        it("falhar se o cliente não existir", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {} as any,
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            // como nenhum cliente foi informado, retorna ao tentar criar um cliente no fluxo de criação de cotação + items
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Nome é obrigatório");
        });
    });

    describe("Add Items", () => {
        // teste para verificar a adição/criação de items

        it("falhar se não tiver ao menos um item", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: [],
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Informe ao menos um item");
        });

        it("falhar se o item não tiver uma posição/ordem", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: [
                    {
                        position: undefined as any,
                        item_basic_data: { ...fakeItens[0] },
                        notes: [],
                        values: {
                            quantity: 2,
                            unit_price: 2
                        }
                    }
                ],
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Cada item deve ter uma posição/ordem");
        });

        it("falhar se mais de um item tem a mesma posição/ordem", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
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
                        position: 1,
                        item_basic_data: { ...fakeItens[1] },
                        notes: [],
                        values: {
                            quantity: 2,
                            unit_price: 2
                        }
                    },
                ],
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("2 items tem o mesmo numero de posição: 1");
        });

        it("falhar se o item não tiver uma descrição", async () => {

            // 1. prepara o payload
            const payload: QuotationPayload = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: [
                    {
                        position: 1,
                        item_basic_data: { ...fakeItens[0], description: "" },
                        notes: [],
                        values: {
                            quantity: 2,
                            unit_price: 2
                        }
                    }
                ],
                quotation: {} as any
            }

            // 2. envia a requisição
            const res = await request(app)
                .post("/quotations/items")
                .send(payload)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            // 3. verifica o resultado
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBe("Cada item deve ter uma descrição");
        });
    });
});