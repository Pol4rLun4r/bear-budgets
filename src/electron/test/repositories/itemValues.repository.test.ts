/// <reference types="vitest/globals" />

import { createDatabase } from "../../db/connection.js";
import { createRepositories } from "../../repositories/index.js";

describe("itemValuesRepository tag", () => {
    const db = createDatabase(":memory:");
    const repository = createRepositories(db).item.values;
    const itemReferenceId = createRepositories(db).item.reference.create({
        description: "Referência para testar tag",
    });

    afterAll(() => {
        db.close();
    });

    it("usa zero quando tag não é informada e persiste os quatro valores permitidos", () => {
        const defaultId = repository.create(itemReferenceId, { position: 0, quantity: 1 });
        expect(repository.getById(defaultId)?.tag).toBe(0);

        for (const tag of [0, 1, 2, 3] as const) {
            const id = repository.create(itemReferenceId, {
                position: tag + 1,
                quantity: 1,
                tag,
            });

            expect(repository.getById(id)?.tag).toBe(tag);
        }
    });

    it("atualiza tag sem alterar os demais dados e rejeita valores inválidos", () => {
        const id = repository.create(itemReferenceId, {
            position: 5,
            quantity: 3,
            unit_price: 18,
        });

        const updated = repository.update(id, { tag: 2 });
        expect(updated).toMatchObject({
            id,
            position: 5,
            quantity: 3,
            unit_price: 18,
            tag: 2,
        });

        expect(() => db.prepare("UPDATE item_values SET tag = 4 WHERE id = ?").run(id)).toThrow();
    });
});
