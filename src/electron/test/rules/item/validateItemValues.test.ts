/// <reference types="vitest/globals" />

import validateItemValues, { rulesCode } from "../../../rules/item/validateItemValues.js";

describe("validateItemValues tag", () => {
    it("aplica zero como padrão e aceita os quatro valores permitidos", () => {
        expect(validateItemValues({ itemValues: { position: 0 } })).toMatchObject({
            success: true,
            data: { itemValues: { tag: 0 } },
        });

        for (const tag of [0, 1, 2, 3] as const) {
            expect(validateItemValues({ itemValues: { position: 0, tag } })).toMatchObject({
                success: true,
                data: { itemValues: { tag } },
            });
        }
    });

    it("rejeita tags que não estejam entre os valores permitidos", () => {
        const itemValues: Partial<ItemValues> = { position: 0 };
        Object.assign(itemValues, { tag: 4 });

        expect(validateItemValues({ itemValues })).toEqual({
            success: false,
            data: rulesCode.INVALID_TAG,
        });
    });
});
