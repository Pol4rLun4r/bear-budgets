/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";
import { fakeItens } from "../../fakeItens.js";

describe("Get all quotations summary", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);

    const payload: CreateWithAllData = {
        client: { ...fakeClients[0] },
        items: [
            {
                item_reference: { ...fakeItens[0] },
                notes: [],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    ipi: 1.3,
                    position: 0
                }
            },
            {
                item_reference: { ...fakeItens[1] },
                notes: [
                    { type: "link", content: '312' }
                ],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    markup: "40.1",
                    position: 1
                }
            },
            {
                item_reference: { ...fakeItens[2] },
                notes: [
                    { type: "link", content: 'https://nota1.com' },
                    { type: "text", content: 'nota 2' }
                ],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    purchase_shipping: 31,
                    st: 43,
                    position: 2
                }
            }
        ],
        quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello world" }
    }

    it("ter sucesso ao pegar as cotações resumidas", () => {
        services.quotation.createWithItems(payload);
        services.quotation.createWithItems(payload);

        const quotations = services.quotation.getAllSummary();

        if(!quotations.success) {
            throw new Error(quotations.data);
        }

        console.log(quotations.data);
    });
});