/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens } from "../../fakeItens.js";

// rules
import { rulesCode } from "../../../rules/item/searchDescription.js";

describe("Pesquisar descrição de itens", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        // cria referências de itens para os testes
        repo.item.reference.create(fakeItens[0]); // cabo
        repo.item.reference.create(fakeItens[1]); // cabo
        repo.item.reference.create(fakeItens[3]); // porca
    });

    it("ter sucesso quando pesquisar sobre a descrição de um item e ter um retorno com e sem acento", () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = "flexivel";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(2);

        expect(res.data[0].description).toEqual(fakeItens[0].description);
        expect(res.data[1].description).toEqual(fakeItens[1].description);
    });

    // teste para ter sucesso quando pesquisar mais especificamente por uma descrição
    it("ter sucesso quando pesquisar mais especificamente por uma descrição", () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = "Cabo flexivel preto";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);

        expect(fakeItens[1].description).toBe(res.data[0].description);
    });

    it("encontrar itens pelo código interno", () => {
        const res = services.item.searchDescription("INT-EL-001");

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);
        expect(res.data[0].internal_code).toBe(fakeItens[0].internal_code);
    });

    it("encontrar itens pelo código do fabricante", () => {
        const res = services.item.searchDescription("FAB-CAB-250-PT");

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);
        expect(res.data[0].manufacturer_code).toBe(fakeItens[1].manufacturer_code);
    });

    it("encontrar item pelo código do fabricante mesmo quando a descrição pesquisada diverge", () => {
        const manufacturerCode = "FAB-DESCRIPTION-MISMATCH-001";
        const savedItem = {
            description: manufacturerCode,
            manufacturer_code: manufacturerCode,
        };
        repo.item.reference.create(savedItem);

        const res = services.item.searchDescription({
            description: "Porta de madeira",
            manufacturer_code: manufacturerCode,
        });

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);
        expect(res.data[0].description).toBe(manufacturerCode);
        expect(res.data[0].manufacturer_code).toBe(manufacturerCode);
    });

    it("encontrar itens pelo código interno digitado no próprio campo", () => {
        const internalCode = "INT-DESCRIPTION-MISMATCH-001";
        repo.item.reference.create({
            description: "Descrição original",
            internal_code: internalCode,
        });

        const res = services.item.searchDescription({
            description: "Outra descrição",
            internal_code: internalCode,
        });

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);
        expect(res.data[0].internal_code).toBe(internalCode);
    });

    it("priorizar correspondências exatas de código sem duplicar resultados", () => {
        const exactInternalCode = "INT-PRIORITY-QUERY-001";
        const partialInternalCode = `PREFIX-${exactInternalCode}-SUFFIX`;
        repo.item.reference.create({
            description: "Luminária especial de jardim",
            internal_code: exactInternalCode,
        });
        repo.item.reference.create({
            description: "Luminária especial externa",
            internal_code: partialInternalCode,
        });

        const res = services.item.searchDescription({
            description: "Luminária especial",
            internal_code: exactInternalCode,
        });

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(2);
        expect(res.data[0].internal_code).toBe(exactInternalCode);
        expect(res.data[1].internal_code).toBe(partialInternalCode);
    });

    it("ignorar curingas SQL como caracteres literais ao pesquisar códigos", () => {
        const res = services.item.searchDescription("INT_EL");

        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(0);
    });

    // teste para falhar caso nenhum valor seja informado    
    it("falhar caso nenhum valor seja informado", async () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = " ";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        expect(res.data).toBe(rulesCode.DESCRIPTION_NOT_INFORMED);
    });
});
