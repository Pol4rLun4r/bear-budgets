/// <reference types="jest" />

// types
import { SearchClientDataType } from "../../domain/searchClients.rules";

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
            value: 'a'
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

    // Teste para buscar clientes pelo nome e segundo nome
    it('must be successful when searching for customers by name and last name', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'name',
            value: 'ana souza'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.body)).toBe(false);
    });


    // Teste para falhar ao buscar com um misturado entre letras e números
    it('should fail when performing a search with an invalid value', async () => {

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
        expect(clients.body.data).toBe('Busca inválida, não pode conter letras e números juntos');
    })

    // teste para falhar ao buscar um cliente pelo documento e usar letras
    it('should fail when performing a document search, passing letters.', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'document',
            value: 'a'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.body.data).toBe("Não use nomes para buscar um documento");
    });

    // Teste para falhar ao buscar um cliente pelo nome e usar números
    it('should fail when performing a name search, passing numbers.', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'name',
            value: '1'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.body.data).toBe("Não use números para buscar um nome");
    });

    // Teste para falhar ao buscar um cliente sem informar o valor de busca
    it('should fail when performing a search without a value', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: 'document',
            value: ''
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.body.data).toBe("Nenhum valor informado");
    });

    // Teste para falhar ao buscar um cliente sem informar o tipo de busca
    it('should fail when performing a search without a type', async () => {

        // 1. Prepara os dados
        const searchData: SearchClientDataType = {
            type: '' as 'name',
            value: '12'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = await request(app)
            .post("/clients/search")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.body.data).toBe("Por favor, especifique o tipo da busca");
    });
});