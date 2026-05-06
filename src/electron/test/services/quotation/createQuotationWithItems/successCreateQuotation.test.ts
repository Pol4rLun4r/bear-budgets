/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";

describe("Part 2 success create quotation - Create Quotation and Add Items", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
    })

    it("ter sucesso ao criar uma nova cotação com notas e status", async () => {
        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: [
                {
                    item_reference: { ...fakeItens[0] },
                    notes: [],
                    item_version: {
                        quantity: 2,
                        unit_price: 2,
                        position: 0
                    }
                },
                {
                    item_reference: { ...fakeItens[0] },
                    notes: [
                        { type: "link", content: '312' }
                    ],
                    item_version: {
                        quantity: 2,
                        unit_price: 2,
                        position: 1
                    }
                }
            ],
            quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello World" }
        }

        // 2. envia a requisição
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        }

        const quotationLinks = response.data;

        // 3. verifica o resultado
        const sameQuotationVersionId = quotationLinks[0].quotation_version_id; // o id de quotation_version_id deve ser o mesmo para todos os quotation_link, no caso o primeiro link tem o mesmo quotation_version_id dos demais

        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

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
