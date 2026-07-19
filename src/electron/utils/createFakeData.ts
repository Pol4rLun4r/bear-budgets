import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { createServices } from "../services/index.js";

const createRandomQuotationPayload = (): CreateQuotation => {
    const itemCount = Math.floor(Math.random() * 5) + 1;

    const items = Array.from({ length: itemCount }, (_, position) => {
        const randomItem = fakeItens[Math.floor(Math.random() * fakeItens.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unitPrice = Number((Math.random() * 100 + 1).toFixed(2));
        const hasReferenceLink = Math.random() > 0.5;

        return {
            item_reference: { ...randomItem },
            reference_links: hasReferenceLink
                ? [{ content: 'https://mantine.dev/llms/getting-started.md' }]
                : [],
            item_values: {
                quantity,
                unit_price: unitPrice,
                position
            }
        };
    });

    const totalValue = Number(
        items.reduce((sum, item) => sum + item.item_values.quantity * item.item_values.unit_price, 0).toFixed(2)
    );

    return {
        items,
        quotation: {
            amount: items.length,
            total_value: totalValue,
            notes: `Orçamento aleatório ${Math.floor(Math.random() * 1000)}`
        }
    };
};

export const createFakeData = (db: Database) => {
    if (!isDev()) return;

    const repo = createRepositories(db);
    const services = createServices(db);

    const fakeReferenceLinks = [
        { content: 'https://mantine.dev/llms/getting-started.md' },
        { content: 'https://mantine.dev/llms/error-page.md' },
    ];

    // Cria itens falsos
    fakeItens.forEach((item) => {
        const itemReferenceId = repo.item.createReference(item);
        fakeReferenceLinks.forEach((link) => {
            repo.item.createReferenceLink(itemReferenceId, {...link, item_reference_id: itemReferenceId});
        });
    });

    // Cria falsos orçamentos
    for (let index = 0; index < 50; index++) {
        services.quotation.create(createRandomQuotationPayload());
    }
}