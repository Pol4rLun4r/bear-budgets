/// <reference types="vitest/globals" />

// types
import type { ClientQuery } from "../../types/client";

// api
import request from "supertest";

// api
import { createTestApp } from "../../utils/createTestApp";

// utils
import { fakeClients } from "./fakeClients";
import { normalizeDocument } from "../../utils/clean";

// repositories
import { createRepositories } from "../../repositories";

// função para verificar se os dados do cliente enviados são os mesmo vindo do banco de dados
const expectClientMatchesRequest = (responseData: any, requestData: ClientQuery) => {
    expect(responseData).toBeDefined(); // verifica se houve algum retorno

    if (requestData.name?.length! > 0) {
        expect(requestData.name?.toLocaleLowerCase()).toBe(responseData.name); // verifica se os nomes batem
    }

    if (requestData.document) {
        expect(normalizeDocument(requestData.document)).toBe(normalizeDocument(responseData.document)); // verifica se os documentos batem
    }

    if (requestData.type_client) {
        expect(requestData.type_client?.toLocaleLowerCase()).toBe(responseData.type_client); // verifica se o tipo de cliente bate
    }

    if (requestData.notes) {
        expect(requestData.notes).toBe(responseData.notes); // verifica se as notas batem
    }
};

describe('POST/ Create client', () => {
    // Criar banco de dados antes dos testes
    const { app, db } = createTestApp();

    // repo
    const repo = createRepositories(db);

    // Preparar dados
    fakeClients.map((client) => {
        repo.client.create(client);
    });

    it('ter sucesso ao criar um novo cliente', async () => {
        // 1. Prepara os dados
        const data: ClientQuery = {
            name: 'Pedro',
            document: '926.102.250-24',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(data)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const clientId = client.body?.data?.id;

        const getClientIdInDatabase = repo.client.getById(clientId)?.id;

        // 3. verifica se houve o retorno correto
        expect(clientId).toBe(getClientIdInDatabase); // verificar se o id do cliente criado é o mesmo presente no banco de dados
        expectClientMatchesRequest(client.body?.data, data);
    });

    it('ter sucesso ao criar um novo cliente, onde o documento é o mesmo, retornando o cliente existente', async () => {
        // 1. Prepara os dados
        const data: ClientQuery = {
            name: 'Pedro',
            document: '1114-4477735',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(data)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const clientId = client.body?.data?.id;

        const getClientIdInDatabase = repo.client.getById(clientId)?.id;

        // 3. verifica se houve o retorno correto
        expect(clientId).toBe(getClientIdInDatabase); // verificar se o id do cliente criado é o mesmo presente no banco de dados
        expect(normalizeDocument(data.document)).toBe(client.body?.data.document) // verifica se o documento é o mesmo
    });

    it('falhar ao tentar criar um novo cliente sem um nome', async () => {
        // 1. Prepara os dados
        const searchData: ClientQuery = {
            name: '',
            document: '4006.530.360-19',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const clientData = client.body?.data;

        // 3. verifica se houve o retorno correto
        expect(clientData).toBe('Nome é obrigatório');
    });

    it('falhar ao tentar criar um novo cliente sem um documento', async () => {
        // 1. Prepara os dados
        const searchData: ClientQuery = {
            name: 'Jorge',
            document: '',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const clientData = client.body?.data;

        // 3. verifica se houve o retorno correto
        expect(clientData).toBe('Documento é obrigatório');
    });

    it('falhar ao tentar criar um novo cliente sem um documento válido', async () => {
        // 1. Prepara os dados
        const searchData: ClientQuery = {
            name: 'Matheus',
            document: '571.005.570-033',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const clientData = client.body?.data;

        // 3. verifica se houve o retorno correto
        expect(clientData).toBe('Informe um documento válido');
    });

    it('falhar ao tentar criar um novo cliente sem um tipo de cliente válido', async () => {
        // 1. Prepara os dados
        const searchData = {
            name: 'Matheus',
            document: '571.005.570-03',
            type_client: 'ration',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const clientData = client.body?.data;

        // 3. verifica se houve o retorno correto
        expect(clientData).toBe('Por favor, especifique o tipo do cliente. Internacional ou Nacional');
    });
});
