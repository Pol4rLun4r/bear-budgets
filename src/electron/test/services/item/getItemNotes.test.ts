/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";

describe('Get item notes', () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // cria item com notas
    const itemReference: ItemReference = { description: "Monster" };
    const itemReferenceId = repo.item.createReference(itemReference);

    const itemNotes: ItemNote[] = [
        {
            item_reference_id: itemReferenceId,
            content: 'material contra explosão',
            type: 'text'
        },
        {
            item_reference_id: itemReferenceId,
            content: 'https://aluminium.wetzel.com.br/produtos/',
            type: 'link'
        },
    ];

    itemNotes.forEach(note => {
        repo.item.createNote(note.item_reference_id, { ...note })
    });

    it('ter sucesso ao pegar as notas do item', () => {
        // 1. prepara o payload
        const payload = itemReferenceId;

        // 2. chama o serviço
        const res = services.item.getNotes(payload);

        // 3. verifica se houve o retorno correto
        if (!res.success) throw new Error("Falha ao pegar notas: " + res.data);

        expect(res.data).toMatchObject(itemNotes);
    });


    it('falhar ao pegar as notas de um item de referência que não existe', () => {
        // 1. prepara o payload
        const payload = 9999;

        // 2. chama o serviço
        const res = services.item.getNotes(payload);

        // 3. verifica se houve o retorno correto
        expect(res.success).toBe(false);
        expect(res.data).toBe("ID da referência do item não existe");
    })
});