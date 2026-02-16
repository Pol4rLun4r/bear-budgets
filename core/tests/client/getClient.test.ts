/// <reference types="vitest/globals" />

// api
import request from "supertest";
import { createTestApp } from "../../utils/createTestApp";

// repositories
import { createRepositories } from "../../repositories";

// utils
import { fakeClients } from "./fakeClients";

describe("GET/ Get client", () => {
    const { app, db } = createTestApp();
    const repo = createRepositories(db);

    fakeClients.map((client) => {
        repo.client.create(client);
    });

    // Teste para pegar um cliente pelo id
    it("must be successful when getting a client by id", async () => {
        const clientId = 1;

        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: clientId })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const clientInDb = repo.client.getById(clientId);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(clientInDb);
        expect(response.body.data.id).toBe(clientId);
    });

    // Teste para pegar um cliente por um id diferente
    it("must be successful when getting a client by different id", async () => {
        const clientId = 4;

        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: clientId })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(clientId);
    });

    // Teste falha ao não informar nenhum id
    it("should fail when client_id is not provided", async () => {
        const response = await request(app)
            .get("/clients/get")
            .query({})
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente ID não informado");
    });

    // Teste falha ao não informar nenhum id
    it("should fail when client_id is undefined", async () => {
        const response = await request(app)
            .get("/clients/get")
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente ID não informado");
    });

    // Teste falha ao buscar um cliente que não existe
    it("should fail when client does not exist", async () => {
        const nonExistentId = 9999;

        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: nonExistentId })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente não existe");
    });

    // Teste falha ao informar um client id não existe, no caso '0'
    it("should fail when client_id is zero", async () => {
        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: 0 })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente ID não informado");
    });
});
