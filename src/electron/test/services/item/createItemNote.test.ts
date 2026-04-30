/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";

describe('Create Item note', () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    const itemReference: ItemReference = {
        description: "Monster",
    };

    const itemReferenceId = repo.item.createReference(itemReference);

    afterEach(() => {
        repo.item.deleteAllNotesByReferenceId(itemReferenceId);
    });

    const notePayload: ItemNote = {
        content: 'material caro',
        type: 'text',
        item_reference_id: itemReferenceId
    };

    it('ter sucesso ao criar uma nova nota ao item de referencia', () => {
        // 1. prepara o payload
        const payload = notePayload;

        // 2. chama o serviço
        const res = services.item.createNote(payload);

        // 3. verifica se houve o retorno correto
        if (!res.success) throw new Error("Falha ao criar nota: " + res.data);

        const notes = repo.item.getReferenceNotesByReferenceId(itemReferenceId);;
        expect(notes[0]).toMatchObject(notePayload);
    });

    it('falhar ao criar uma nota para uma referência de item que não existe', () => {
        // 1. prepara o payload
        const payload = { ...notePayload, item_reference_id: 9999 };

        // 2. chama o serviço
        const note = services.item.createNote(payload);

        // 3. verifica se houve o retorno correto
        expect(note.success).toBe(false);
        expect(note.data).toBe("item_reference_id não existe ou não foi informado");
    });

    it('falhar ao criar uma nota quando o conteúdo não é informado', () => {
        // 1. prepara o payload
        const payload = { ...notePayload, content: undefined } as any;

        // 2. chama o serviço
        const note = services.item.createNote(payload);

        // 3. verifica se houve o retorno correto
        expect(note.success).toBe(false);
        expect(note.data).toBe("Conteúdo não foi informado");
    });

    it('falhar ao criar uma nota quando o tipo não é válido', () => {
        // 1. prepara o payload
        const payload = { ...notePayload, type: 'invalid' } as any;

        // 2. chama o serviço
        const note = services.item.createNote(payload);

        // 3. verifica se houve o retorno correto
        expect(note.success).toBe(false);
        expect(note.data).toBe(`Este tipo:${payload.type} de nota não é válido`);
    });
});



