/// <reference types="vitest/globals" />

// api
import request from "supertest";

// utils
import { createTestApp } from "../../utils/createTestApp";
import { fakeClients } from "../client/fakeClients";

// repositories
import { createRepositories } from "../../repositories";

// types
import type { addItemQuery } from "../../types/item";

describe("POST /quotations/items - Add Items to Quotation", () => {
    const { app, db } = createTestApp();
    const repo = createRepositories(db);

    // garante que tenha um client e uma quotation_version disponíveis para os testes
    let quotationVersionId: number;

    beforeAll(() => {
        // 1. cria um cliente para poder criar a cotação
        const client = fakeClients[0];
        repo.client.create({
            name: client.name,
            document: client.document!,
            type_client: client.type_client!,
            notes: client.notes ?? null,
        });
    });

    beforeEach(async () => {
        // 2. cria uma nova cotação (e com isso a versão 1) para cada teste
        const clientId = repo.client.getById(1)?.id!;
        const quotationVersionIdRaw = repo.quotation.create({
            client_id: clientId,
            notes: null,
            status: 0,
        });
        quotationVersionId = quotationVersionIdRaw;
    });

    // teste para adicionar um item à cotação
    it("must be successful when adding one item to the quotation", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [
                {
                    description: "Parafuso sextavado M8",
                    quantity: 100,
                    unit_price: 0.45,
                } as addItemQuery,
            ],
        };

        // 2. envia a requisição
        const res = await request(app)
            .post("/quotations/items")
            .send(payload)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toHaveLength(1);

        // 4. verifica os dados do item adicionado
        const [added] = res.body.data;

        expect(added).toHaveProperty("item_reference_id");
        expect(added).toHaveProperty("item_version_id");
        expect(added).toHaveProperty("quotation_version_item_id");

        // 5. verifica no banco: referência criada
        const ref = repo.item.getReferenceById(added.item_reference_id);
        expect(ref).toBeDefined();
        expect(ref!.description).toBe("Parafuso sextavado M8");

        // 6. verifica no banco: versão 1 do item com quantity e unit_price
        const versionRow = db.prepare(
            "SELECT * FROM item_versions WHERE id = ?"
        ).get(added.item_version_id) as {
            item_reference_id: number;
            version: number;
            quantity: number;
            unit_price: number | null;
        };
        expect(versionRow.item_reference_id).toBe(added.item_reference_id);
        expect(versionRow.version).toBe(1);
        expect(versionRow.quantity).toBe(100);
        expect(versionRow.unit_price).toBe(0.45);

        // 7. verifica no banco: link quotation_version <-> item_version
        const linkRow = db.prepare(
            "SELECT * FROM quotation_version_items WHERE quotation_version_id = ? AND item_version_id = ?"
        ).get(quotationVersionId, added.item_version_id);
        expect(linkRow).toBeDefined();
    });

    // teste para adicionar múltiplos itens à cotação
    it("must be successful when adding multiple items at once", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [
                { description: "Parafuso M8", quantity: 100, unit_price: 0.45 },
                { description: "Porca M8", quantity: 100, unit_price: 0.2 },
            ] as addItemQuery[],
        };

        // 2. envia a requisição
        const res = await request(app)
            .post("/quotations/items")
            .send(payload)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(2);

        // 4. verifica os dados dos itens adicionados
        const ids = res.body.data.map((d: { item_reference_id: number }) => d.item_reference_id);
        expect(ids[0]).not.toBe(ids[1]);

        // 5. verifica no banco: cada item tem sua própria referência e versão 1
        const ref1 = repo.item.getReferenceById(ids[0]);
        const ref2 = repo.item.getReferenceById(ids[1]);
        expect(ref1!.description).toBe("Parafuso M8");
        expect(ref2!.description).toBe("Porca M8");
    });

    // teste para adicionar um item com todos os campos opcionais e notas de referência
    it("must be successful when sending optional fields (internal_code, markup, purchase_freight, ipi, st) and reference notes", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [
                {
                    description: "Item com todos os campos",
                    internal_code: "PROD-001",
                    manufacturer_code: "MFR-X",
                    ncm: "73181590",
                    quantity: 50,
                    unit_price: 10,
                    markup: 30,
                    purchase_freight: 25.5,
                    ipi: 5,
                    st: 15,
                    notes: [
                        { type: "text", content: "Observação importante sobre o item" },
                        { type: "link", content: "https://example.com/ficha-tecnica" },
                    ],
                } as addItemQuery,
            ],
        };

        // 2. envia a requisição
        const res = await request(app)
            .post("/quotations/items")
            .send(payload)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        expect(res.body.success).toBe(true);
        const [added] = res.body.data;

        // 4. verifica no banco: referência criada
        const ref = repo.item.getReferenceById(added.item_reference_id);

        expect(ref!.internal_code).toBe("PROD-001");
        expect(ref!.manufacturer_code).toBe("MFR-X");
        expect(ref!.ncm).toBe("73181590");

        // 5. verifica no banco: notas da referência devem ter sido criadas
        const notes = db.prepare(
            "SELECT type, content FROM item_reference_notes WHERE item_reference_id = ? ORDER BY id ASC"
        ).all(added.item_reference_id) as { type: string; content: string }[];

        expect(notes).toHaveLength(2);
        expect(notes[0].type).toBe("text");
        expect(notes[0].content).toBe("Observação importante sobre o item");
        expect(notes[1].type).toBe("link");
        expect(notes[1].content).toBe("https://example.com/ficha-tecnica");

        // 6. verifica no banco: versão 1 do item com todos os campos opcionais
        const versionRow = db.prepare(
            "SELECT markup, purchase_freight, ipi, st FROM item_versions WHERE id = ?"
        ).get(added.item_version_id) as {
            markup: number | null;
            purchase_freight: number | null;
            ipi: number | null;
            st: number | null;
        };
        expect(versionRow.markup).toBe(30);
        expect(versionRow.purchase_freight).toBe(25.5);
        expect(versionRow.ipi).toBe(5);
        expect(versionRow.st).toBe(15);
    });

    // teste para verificar se a requisição falha quando a versão da cotação não existe
    it("should fail when quotation_version_id does not exist", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: 999999,
            items: [{ description: "Qualquer item", quantity: 1 }],
        };

        // 2. envia a requisição
        const res = await request(app)
            .post("/quotations/items")
            .send(payload)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        expect(res.body.success).toBe(false);
        expect(res.body.data).toBe("Versão da cotação não existe");
    });

    // teste para verificar se a requisição falha quando o array de itens está vazio
    it("should fail when items array is empty", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [],
        };

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

    // teste para verificar se a requisição falha quando o item não tem descrição
    it("should fail when item has no description", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [
                { description: "", quantity: 1 },
                { description: "   ", quantity: 1 },
            ],
        };

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

    // teste para verificar se a requisição falha quando a quantidade é zero ou negativa
    it("should fail when quantity is zero or negative", async () => {

        // 1. prepara o payload
        const payload = {
            quotation_version_id: quotationVersionId,
            items: [{ description: "Item válido", quantity: 0 }],
        };

        // 2. envia a requisição
        const res = await request(app)
            .post("/quotations/items")
            .send(payload)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica o resultado
        expect(res.body.success).toBe(false);
        expect(res.body.data).toBe("Quantidade deve ser maior que zero");
    });
});
