/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens, fakeItemValues } from "../../fakeItens.js";
import { rulesCode } from "../../../rules/quotation/updateLine.js";

describe("Atualizar linha de cotação", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        const itemId = repo.item.reference.create(fakeItens[2]);

        db.prepare(`
            INSERT INTO reference_links (item_reference_id, content)
            VALUES (?, ?)
        `).run(itemId, 'https://family.com');
    })

    const payload: CreateQuotation = {
        items: [
            {
                item_reference: { ...fakeItens[1] },
                reference_links: [
                    { content: 'mother' }
                ],
                item_values: fakeItemValues(1, {
                    quantity: 22,
                    unit_price: 12,
                    markup: "40%",
                    extra_value: 15.5,
                }),
            }
        ],
        quotation: { amount: 1, total_value: 431.32, notes: "Hello world" }
    }

    it("deve atualizar uma linha de cotação existente", () => {
        const create = services.quotation.create(payload);

        if (!create.success) {
            throw new Error(create.data);
        }

        const quotationLinkId = create.data?.[0].id as number;

        const payloadEdit: UpdateQuotationLinePayload = {
            quotation_link_id: quotationLinkId,
            item_reference: { ...fakeItens[1], id: 1 },
            item_values: fakeItemValues(1, {
                quantity: 100,
                unit_price: 10,
                markup: "50%",
                extra_value: 20,
            }),
            reference_links: [
                { content: 'mother' },
                { content: 'father' }
            ]
        };

        const update = services.quotation.updateLine(payloadEdit);

        expect(update.success).toBe(true);
        if (!update.success) {
            throw new Error(update.data);
        }

        expect(update.data.item_reference?.description).toBe(fakeItens[1].description);
        expect(update.data.item_values?.unit_price).toBe(10);
        expect(update.data.item_values?.quantity).toBe(100);
        expect(update.data.reference_links).toHaveLength(2);
    });

    it("deve falhar quando a descrição do novo item_reference não foi informada", () => {
        const response = services.quotation.updateLine({
            quotation_link_id: 1,
            item_reference: {},
            item_values: {},
            reference_links: [],
        } as UpdateQuotationLinePayload);

        expect(response.success).toBe(false);
        expect(response.data).toBe(rulesCode.ITEM_REFERENCE_DESCRIPTION_NOT_INFORMED);
    });

});