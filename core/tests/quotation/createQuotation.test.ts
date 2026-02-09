/// <reference types="jest" />

import type { createQuotationType } from "../../domain/createQuotation.rules";

// jest
import request from "supertest";

// api
import { createTestApp } from '../../utils/createTestApp';

// repositories
import { getQuotationByIdRepository } from "../../repositories/quotation.repository";
import { ClientQuery, createClientRepository } from "../../repositories/client.repository";

describe("POST/ Create Quotation", () => {

    // Teste básico para criar uma cotação com cliente novo
    it('should create a quotation with a new client', async () => {
        const { app, db } = createTestApp();

        // 1. Prepare os dados necessários
        const quotationData: createQuotationType = {
            name: "Maria Oliveira",
            document: "987.654.321-00",
            type_client: "Nacional",
            notes: "Novo cliente para cotação",
            status: 0
        }

        // 2. Chama o serviço para criar a cotação com cliente
        const quotation = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const checkQuotation = getQuotationByIdRepository(db)
            (quotation.body.data as number);

        // 3. Verifica se a cotação foi criada corretamente
        expect(checkQuotation).toBeDefined();
    })

    // Teste para criar uma cotação com cliente existente
    it('should create a quotation with an existing client', async () => {
        const { app, db } = createTestApp();

        // 1. Prepara os dados do cliente existente
        const clientData: ClientQuery = {
            name: "Carlos Pereira",
            document: "123.456.789-00",
            type_client: "Nacional",
            notes: "Cliente existente",
        }

        // 2. Cria o cliente existente
        const clientResponse = createClientRepository(db)(clientData);
        const clientId = clientResponse as number | undefined

        // 3. Prepara os dados da cotação usando o ID do cliente existente
        const quotationData: createQuotationType = {
            client_id: clientId,
            status: 0
        };

        // 4. Chama o serviço para criar a cotação com o cliente existente
        const quotation = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const checkQuotation = getQuotationByIdRepository(db)
            (quotation.body.data as number);

        // 5. Verifica se a cotação foi criada corretamente
        expect(checkQuotation).toBeDefined();
    });

    // Testa para falhar caso o Client ID não exista
    it('should fail to create a quote when the client id does not exist', async () => {
        const { app } = createTestApp();

        // 1. Prepara os dados da cotação usando o id que não existe,
        const quotationData: createQuotationType = {
            client_id: 9999,
            status: 0
        };

        // 2. Chama o serviço para criar a cotação e espera o erro
        const response = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. Verifica se o erro esperado foi retornado
        expect(response.body.data).toBe("Client ID does not exist");
    });

    // Testa para falhar caso o nome esteja faltando para novo cliente
    it('should fail to create a quote when name are missing for new client', async () => {
        const { app } = createTestApp();

        // 1. Prepara os dados da cotação sem o nome 
        const quotationData: createQuotationType = {
            document: "123.456.789-00",
            type_client: "Nacional",
            notes: "Cliente novo",
            status: 0
        };

        // 2. Chama o serviço para criar a cotação e espera o erro
        const response = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. Verifica se o erro esperado foi retornado
        expect(response.body.data).toBe("Provide either name/document to create client, or existing client_id");
    });

    // Testa para falhar caso o documento esteja faltando para novo cliente
    it('should fail to create a quote when document are missing for new client', async () => {
        const { app } = createTestApp();

        // 1. Prepara os dados da cotação sem o documento 
        const quotationData: createQuotationType = {
            name: "Aílson mendes",
            type_client: "Nacional",
            notes: "Cliente novo",
            status: 0
        };

        // 2. Chama o serviço para criar a cotação e espera o erro
        const response = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. Verifica se o erro esperado foi retornado
        expect(response.body.data).toBe("Provide either name/document to create client, or existing client_id");
    });

    // Testa para falhar caso o formato do documento seja inválido para novo cliente
    it('should fail to create a quote when document format is invalid for new client', async () => {
        const { app } = createTestApp();

        // 1. Prepara os dados da cotação com documento inválido
        const quotationData: createQuotationType = {
            name: "Aílson mendes",
            document: "invalid-document",
            type_client: "Nacional",
            notes: "Cliente novo",
            status: 0
        };

        // 2. Chama o serviço para criar a cotação e espera o erro
        const response = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. Verifica se o erro esperado foi retornado
        expect(response.body.data).toBe("Invalid document format. Must be a valid CPF or CNPJ");
    });

    // Teste para falhar caso type_client seja inválido
    it('should fail to create a quote when type_client is invalid', async () => {
        const { app } = createTestApp();

        // 1. Prepara os dados da cotação com type_client inválido
        const quotationData: createQuotationType = {
            name: "Ana Silva",
            document: "954.083.690-56",
            type_client: "InvalidType" as any,
            notes: "Cliente com tipo inválido",
            status: 0
        };

        // 2. Chama o serviço para criar a cotação e espera o erro
        const response = await request(app)
            .post("/quotations")
            .send(quotationData)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        // 3. Verifica se o erro esperado foi retornado
        expect(response.body.data).toBe("Invalid client type. Must be either 'Nacional' or 'Internacional'");
    });
});