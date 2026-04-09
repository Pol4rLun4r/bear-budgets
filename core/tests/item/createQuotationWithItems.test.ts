/// <reference types="vitest/globals" />

// api
import request from "supertest";

// utils
import { createTestApp } from "../../utils/createTestApp";
import { fakeClients } from "../client/fakeClients";

// types 
import type { QuotationPayload } from "../../services/createQuotationWithItems.service";

// repositories
import { createRepositories } from "../../repositories";

describe("POST /quotations/items - Create Quotation and Add Items", () => {
    const { app, db } = createTestApp();
    const repo = createRepositories(db);

    describe("Client", () => {

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
    })
});