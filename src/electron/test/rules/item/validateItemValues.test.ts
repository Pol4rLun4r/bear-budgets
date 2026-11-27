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

    describe("validateItemValues discount", () => {
        it("defaults the discount type to fixed and accepts a percentage with two decimals", () => {
            expect(validateItemValues({
                itemValues: { position: 0, discount_value: 10.33, discount_type: "percentage" },
            })).toMatchObject({
                success: true,
                data: { itemValues: { discount_value: 10.33, discount_type: "percentage" } },
            });

            expect(validateItemValues({
                itemValues: { position: 0, discount_value: 5.25 },
            })).toMatchObject({
                success: true,
                data: { itemValues: { discount_value: 5.25, discount_type: "fixed" } },
            });
        });

        it.each([
            ["negative", -1, "fixed"],
            ["too many decimals", 10.333, "percentage"],
            ["invalid type", 10, "cash"],
        ])("rejects a %s discount", (_label, value, type) => {
            const itemValues: Partial<ItemValues> = { position: 0 };
            Object.assign(itemValues, { discount_value: value, discount_type: type });

            expect(validateItemValues({ itemValues }).success).toBe(false);
        });
    });
});
