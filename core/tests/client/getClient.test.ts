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

    it("ter sucesso pegar um cliente pelo id", async () => {
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

    it("ter sucesso ao pegar um cliente por um id diferente", async () => {
        const clientId = 4;

        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: clientId })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(clientId);
    });

    it("falhar quando o id de cliente não é informado", async () => {
        const response = await request(app)
            .get("/clients/get")
            .query({})
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente ID não informado");
    });

    it("falhar ao tentar buscar/pegar dados de um id de client que não existe", async () => {
        const nonExistentId = 9999;

        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: nonExistentId })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente não existe");
    });

    it("falhar quando o cliente id é zero", async () => {
        const response = await request(app)
            .get("/clients/get")
            .query({ client_id: 0 })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(false);
        expect(response.body.data).toBe("Cliente ID não informado");
    });
});
