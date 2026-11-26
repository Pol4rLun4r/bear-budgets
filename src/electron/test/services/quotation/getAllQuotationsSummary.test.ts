/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens, fakeItemValues } from "../../fakeItens.js";

describe("Pegar cotações resumidas", () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);

    const payloads: CreateQuotation[] = [
        {
            items: [
                {
                    item_reference: { ...fakeItens[0], notes: "Cabo para instalação interna" },
                    reference_links: [],
                    item_values: fakeItemValues(0, {
                        ipi: 1.3,
                        boarding: 3,
                        delivery: 5,
                    }),
                },
            ],
            quotation: { amount: 1, total_value: 21.3, notes: "Hello world" }
        },
        {
            items: [
                {
                    item_reference: { ...fakeItens[1], notes: "Cabo para instalação externa" },
                    reference_links: [],
                    item_values: fakeItemValues(1, {
                        ipi: 1.3,
                        boarding: 4,
                        delivery: 6,
                    }),
                },
            ],
            quotation: { amount: 1, total_value: 21.3, notes: "Hello world" }
        }
    ];

    beforeEach(() => {
        db.prepare("DELETE FROM quotation_links").run();
        db.prepare("DELETE FROM item_values").run();
        db.prepare("DELETE FROM reference_links").run();
        db.prepare("DELETE FROM item_references").run();
        db.prepare("DELETE FROM quotations").run();
    });

    it("deve retornar o resumo das cotações cadastradas sem carregar detalhes de itens", () => {
        const firstCreate = services.quotation.create(payloads[0]);
        const secondCreate = services.quotation.create(payloads[1]);

        if (!firstCreate.success) {
            throw new Error(firstCreate.data);
        }

        if (!secondCreate.success) {
            throw new Error(secondCreate.data);
        }

        const quotations = services.quotation.getAllSummary();

        if (!quotations.success) {
            throw new Error(quotations.data);
        }

        const quotationData = quotations.data;

        expect(quotationData).toHaveLength(2);
        expect(quotationData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: 0,
                    amount: payloads[0].quotation.amount,
                    total_value: payloads[0].quotation.total_value,
                    notes: payloads[0].quotation.notes,
                }),
                expect.objectContaining({
                    id: expect.any(Number),
                    status: 0,
                    amount: payloads[1].quotation.amount,
                    total_value: payloads[1].quotation.total_value,
                    notes: payloads[1].quotation.notes,
                }),
            ]),
        );

        quotationData.forEach((quotation) => {
            expect(quotation).not.toHaveProperty("items");
            expect(quotation).not.toHaveProperty("reference_links");
            expect(quotation).not.toHaveProperty("item_values");
        });
    });

    it("deve retornar todos os resultados encontrados por anotação ou ID exibido", () => {
        const insertQuotation = db.prepare(`
            INSERT INTO quotations (id, status, notes, total_value, amount)
            VALUES (?, 0, ?, 0, 1)
        `);

        for (let id = 1; id <= 60; id += 1) {
            insertQuotation.run(id, `Anotação sem correspondência ${id}`);
        }

        insertQuotation.run(900001, "Encontrar este orçamento");
        insertQuotation.run(900002, "Outra ocorrência: encontrar");
        insertQuotation.run(900003, "Encontrar a terceira correspondência");

        const notesResults = services.quotation.getAllSummary("ENCONTRAR");
        if (!notesResults.success) {
            throw new Error(notesResults.data);
        }

        expect(notesResults.data.map(({ id }) => id)).toEqual([900003, 900002, 900001]);

        const idResults = services.quotation.getAllSummary("000003");
        if (!idResults.success) {
            throw new Error(idResults.data);
        }

        expect(idResults.data.map(({ id }) => id)).toEqual([3]);
    });

    it("deve rejeitar parâmetros de pesquisa que não sejam texto", () => {
        const result = services.quotation.getAllSummary(42);

        expect(result).toEqual({
            success: false,
            data: "A pesquisa deve ser um texto válido",
            code: "INVALID_SEARCH_QUERY",
        });
    });
});