/// <reference types="jest" />

// types
import { SearchClientDataType } from "../../services/searchClients.service";

// jest
import request from "supertest"

// api
import { createTestApp } from "../../utils/createTestApp";

// repositories
import { createClientRepository } from "../../repositories/client.repository";
import { fakeClients } from "./fakeClients";

const hasItems = (arr: unknown[]): boolean => {
    return arr.length > 0;
};

describe("POST/ Search Clients", () => {
    // Criar banco de dados antes dos testes
    const { app, db } = createTestApp();

    // Preparar dados
    fakeClients.map((client) => {
        createClientRepository(db)(client)
    })

    // Teste para buscar clientes pelo documento
    it('must be successful when searching for customers by document', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'document',
            value: '12'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.body)).toBe(false)
    });

    // Teste para buscar clientes pelo nome
    it('must be successful when searching for customers by name', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'name',
            value: 'e'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.body)).toBe(false)
    });

    it('should fail to do a search and find nothing', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'name',
            value: 'e23d1312d3d2d2d'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.body.data).toBe('No customers found');
    })
});