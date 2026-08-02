/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";
import { rulesCode as itemRulesCode } from "../../../rules/item/createAndAdd.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItemValues, fakeItens } from "../../fakeItens.js";

describe("Adicionar itens a uma cotação que já existe", () => {
    let db: ReturnType<typeof createDatabase>;
    let services: ReturnType<typeof createServices>;
    let repo: ReturnType<typeof createRepositories>;

    beforeEach(() => {
        db = createDatabase(getDBPath());
        services = createServices(db);
        repo = createRepositories(db);

        fakeItens.forEach((item) => {
            repo.item.reference.create(item);
        });
    });

    const createQuotationPayload = (): CreateQuotation => ({
        items: [
            {
                item_reference: { ...fakeItens[1] },
                reference_links: [{ content: "mother" }],
                item_values: fakeItemValues(1, {
                    quantity: 22,
                    unit_price: 12,
                    markup: "40%",
                    extra_value: 15.5,
                }),
            },
        ],
        quotation: { amount: 1, total_value: 431.32, notes: "Hello world" },
    });

    test("deve adicionar itens a uma cotação existente", () => {
        const create = services.quotation.create(createQuotationPayload());

        expect(create.success).toBe(true);

        const quotationLinks = create.data as QuotationLink[];
        const quotationId = quotationLinks[0].quotation_id as number;

        const itemPayload: AddToQuotationPayload = {
            quotation: {
                id: quotationId,
                amount: 1,
                total_value: 431.32,
            },
            items: [
                {
                    item_reference: { ...fakeItens[2] },
                    reference_links: [{ content: "debug" }],
                    item_values: fakeItemValues(2, {
                        quantity: 87,
                        unit_price: 98,
                        markup: "65%",
                        extra_value: 15.5,
                    }),
                },
            ],
        };

        const res = services.item.addToQuotation(itemPayload);

        expect(res.success).toBe(true);
        expect(res.data).toHaveLength(1);
        expect(res.data[0]).toMatchObject({
            quotation_id: quotationId,
            item_reference_id: expect.any(Number),
        });
    });

    test("falha quando a cotação não existe", () => {
        const res = services.item.addToQuotation({
            quotation: {
                id: 999999,
                amount: 1,
                total_value: 431.32,
            },
            items: [
                {
                    item_reference: { ...fakeItens[2] },
                    reference_links: [{ content: "debug" }],
                    item_values: fakeItemValues(2),
                },
            ],
        });

        expect(res.success).toBe(false);
        expect(res.data).toBe(itemRulesCode.QUOTATION_NOT_EXISTS);
    });

    test("falha quando não há itens no payload", () => {
        const create = services.quotation.create(createQuotationPayload());
        expect(create.success).toBe(true);

        const quotationLinks = create.data as QuotationLink[];
        const quotationId = quotationLinks[0].quotation_id as number;

        const res = services.item.addToQuotation({
            quotation: {
                id: quotationId,
                amount: 1,
                total_value: 431.32,
            },
            items: [],
        });

        expect(res.success).toBe(false);
        expect(res.data).toBe(itemRulesCode.NO_ITEMS);
    });

    test("falha quando um item não informa a posição", () => {
        const create = services.quotation.create(createQuotationPayload());
        expect(create.success).toBe(true);

        const quotationLinks = create.data as QuotationLink[];
        const quotationId = quotationLinks[0].quotation_id as number;

        const res = services.item.addToQuotation({
            quotation: {
                id: quotationId,
                amount: 1,
                total_value: 431.32,
            },
            items: [
                {
                    item_reference: { ...fakeItens[2] },
                    reference_links: [],
                    item_values: {
                        ...fakeItemValues(2),
                        position: undefined as unknown as number,
                    },
                },
            ],
        });

        expect(res.success).toBe(false);
        expect(res.data).toBe(itemRulesCode.POSITION_NOT_INFORMED);
    });

    test("falha quando mais de um item tem a mesma posição", () => {
        const create = services.quotation.create(createQuotationPayload());
        expect(create.success).toBe(true);

        const quotationLinks = create.data as QuotationLink[];
        const quotationId = quotationLinks[0].quotation_id as number;

        const res = services.item.addToQuotation({
            quotation: {
                id: quotationId,
                amount: 1,
                total_value: 431.32,
            },
            items: [
                {
                    item_reference: { ...fakeItens[2] },
                    reference_links: [],
                    item_values: fakeItemValues(1),
                },
                {
                    item_reference: { ...fakeItens[3] },
                    reference_links: [],
                    item_values: fakeItemValues(1),
                },
            ],
        });

        expect(res.success).toBe(false);
        expect(res.data).toBe(itemRulesCode.SAME_POSITION);
    });

    test("falha quando a descrição do item está vazia", () => {
        const create = services.quotation.create(createQuotationPayload());
        expect(create.success).toBe(true);

        const quotationLinks = create.data as QuotationLink[];
        const quotationId = quotationLinks[0].quotation_id as number;

        const res = services.item.addToQuotation({
            quotation: {
                id: quotationId,
                amount: 1,
                total_value: 431.32,
            },
            items: [
                {
                    item_reference: { ...fakeItens[2], description: "   " },
                    reference_links: [],
                    item_values: fakeItemValues(2),
                },
            ],
        });

        expect(res.success).toBe(false);
        expect(res.data).toBe(itemRulesCode.DESCRIPTION_NOT_INFORMED);
    });
});