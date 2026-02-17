/// <reference types="vitest/globals" />

// types
import type { ClientQuery } from "../../../types/client";

// api
import request from "supertest";

// api
import { createTestApp } from "../../utils/createTestApp";

// utils
import { fakeClients } from "./fakeClients";

// repositories
import { createRepositories } from "../../repositories";

describe('POST/ Create client', () => {
    // Criar banco de dados antes dos testes
    const { app, db } = createTestApp();

    // repo
    const repo = createRepositories(db);

    // Preparar dados
    fakeClients.map((client) => {
        repo.client.create(client);
    });

    // Teste para criar um novo cliente
    it('must be successful when creating a new customer', async () => {
        // 1. Prepara os dados
        const searchData: ClientQuery = {
            name: 'Pedro',
            document: '926.102.250-24',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const clientId = client.body?.data?.id;

        const getClientIdInDatabase = repo.client.getById(clientId)?.id;

        // 3. verifica se houve o retorno correto
        expect(clientId).toBe(getClientIdInDatabase);
    });

    // Teste para criar um novo cliente, com ele existindo
    it('must be successful in creating one, where the document is the same, thus returning the existing customer', async () => {
        // 1. Prepara os dados
        const searchData: ClientQuery = {
            name: 'Pedro',
            document: '11144477735',
            type_client: 'nacional',
            notes: 'Cliente brabo'
        };

        // 2. Chama o serviço para buscar o cliente
        const client = await request(app)
            .post("/clients/")
            .send(searchData)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const clientId = client.body?.data?.id;

        const getClientIdInDatabase = repo.client.getById(clientId)?.id;

        // 3. verifica se houve o retorno correto
        expect(clientId).toBe(getClientIdInDatabase);
    });

    // Teste para falhar ao tentar criar um novo cliente sem um nome
    it('should fail when creating a new client without a name', async () => {
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

    // Teste para falhar ao tentar criar um novo cliente sem um documento
    it('should fail when creating a new client without a document', async () => {
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

    // Teste para falhar ao tentar criar um novo cliente sem um documento válido
    it('should fail when creating a new customer without a valid document', async () => {
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

    // Teste para falhar ao tentar criar um novo cliente sem um documento válido
    it('should fail when creating a new client without a valid type', async () => {
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