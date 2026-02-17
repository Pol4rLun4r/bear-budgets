/// <reference types="vitest/globals" />

// api
import request from "supertest";

// utils
import { createTestApp } from "../../utils/createTestApp";

// repositories
import { createRepositories } from "../../repositories";
import { createItemReferenceRepository } from "../../repositories/item.repository";

describe("POST /quotations/items/search-references - Search Item References", () => {
    const { app, db } = createTestApp();
    const repo = createRepositories(db);

    beforeAll(() => {
        const createRef = createItemReferenceRepository(db);

        // cria algumas referências de itens para os testes
        createRef({
            description: "parafuso 3 x 1",
            internal_code: null,
            manufacturer_code: null,
            ncm: null,
        });

        createRef({
            description: "parafuso m8 3 x 1",
            internal_code: null,
            manufacturer_code: null,
            ncm: null,
        });

        createRef({
            description: "porca m8",
            internal_code: null,
            manufacturer_code: null,
            ncm: null,
        });
    });

    // Teste para ter sucesso quando pesquisar sobre a descrição de um item
    it("must be successful when searching by partial description and return multiple references", async () => {

        // 1. prepara os dados
        const payload = {
            query: "parafuso 3 x 1",
        };

        // 2. faz a requisição
        const res = await request(app)
            .post("/quotations/items/search-references")
            .send(payload)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se a requisição teve exito
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

        const descriptions = (res.body.data as { description: string }[])
            .map((item) => item.description)
            .sort();

        expect(descriptions).toEqual(
            ["parafuso 3 x 1", "parafuso m8 3 x 1"].sort()
        );
    });

    // teste para ter sucesso quando pesquisar mais especificamente por uma descrição
    it("must be successful when searching with a more specific description and return a single reference", async () => {
        const payload = {
            query: "parafuso m8 3 x 1",
        };

        const res = await request(app)
            .post("/quotations/items/search-references")
            .send(payload)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].description).toBe("parafuso m8 3 x 1");
    });

    // teste para falhar caso nenhum valor seja informado    
    it("should fail when performing a search without a value", async () => {
        const payload = {
            query: "",
        };

        const res = await request(app)
            .post("/quotations/items/search-references")
            .send(payload)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.success).toBe(false);
        expect(res.body.data).toBe("Nenhum valor informado");
    });
});

