/// <reference types="vitest/globals" />

// type
import { QuotationQuery } from "../../types/quotation";

// api
import request from "supertest";

// api
import { createTestApp } from '../../utils/createTestApp';

// utils
import { fakeClients } from "../client/fakeClients";

// repositories
import { createRepositories } from "../../repositories";

describe("POST/ Create Quotation", () => {
    // Criar banco de dados antes dos testes
    const { app, db } = createTestApp();

    // repo
    const repo = createRepositories(db);

    // Preparar dados
    fakeClients.map((client) => {
        repo.client.create(client);
    });


    // Teste para criar uma nova cotação
    it('must be successful when creating a new quotation', async () => {
        // 1. Prepara os dados
        const clientId = repo.client.getById(1)?.id

        const searchData: QuotationQuery = {
            client_id: clientId!,
            notes: 'hello world',
            status: undefined
        };

        // 2. Chama o serviço para buscar o cliente
        const quotation = await request(app)
            .post("/quotations/")
            .send(searchData)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const quotationId = quotation.body?.data?.quotation_id;

        const getQuotationInDatabase = repo.client.getById(quotationId)?.id;

        // 3. verifica se houve o retorno correto
        expect(quotationId).toBe(getQuotationInDatabase);
    });

    // Teste para criar uma nova cotação sem notas
    it('must be successful when creating a new quotation without notes', async () => {
        // 1. Prepara os dados
        const clientId = repo.client.getById(1)?.id

        const searchData: QuotationQuery = {
            client_id: clientId!,
            notes: '',
            status: undefined
        };

        // 2. Chama o serviço para buscar o cliente
        const quotation = await request(app)
            .post("/quotations/")
            .send(searchData)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const quotationId = quotation.body?.data?.quotation_id;

        const getQuotationInDatabase = repo.client.getById(quotationId)?.id;

        // 3. verifica se houve o retorno correto
        expect(quotationId).toBe(getQuotationInDatabase);
    });

    // Teste para criar uma nova cotação sem status
    it('must be successful when creating a new quotation with different status', async () => {
        // 1. Prepara os dados
        const clientId = repo.client.getById(1)?.id

        const searchData: QuotationQuery = {
            client_id: clientId!,
            notes: '',
            status: 1
        };

        // 2. Chama o serviço para buscar o cliente
        const quotation = await request(app)
            .post("/quotations/")
            .send(searchData)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const quotationId = quotation.body?.data?.quotation_id;

        const getQuotationInDatabase = repo.client.getById(quotationId)?.id;

        // 3. verifica se houve o retorno correto
        expect(quotationId).toBe(getQuotationInDatabase);
    });

    // Teste para falhar ao criar uma nova cotação sem um client_id válido
    it('should fail when creating a new quotation without a valid client_id', async () => {
        // 1. Prepara os dados
        const searchData: QuotationQuery = {
            client_id: 99999999,
            notes: 'Client',
            status: 0
        };

        // 2. Chama o serviço para buscar o cliente
        const quotation = await request(app)
            .post("/quotations/")
            .send(searchData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const quotationData = quotation.body?.data;

        // 3. verifica se houve o retorno correto
        expect(quotationData).toBe('Cliente não existe');
    });
});