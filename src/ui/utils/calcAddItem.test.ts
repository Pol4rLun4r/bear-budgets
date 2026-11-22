import { describe, expect, it } from "vitest";
import calcAddItem from "./calcAddItem";

describe("calcAddItem", () => {
    it("applies extra value after markup and purchase shipping after the extra value", () => {
        const result = calcAddItem({
            quantity: 2,
            unit_price: 10,
            ipi: 10,
            st: 5,
            markup: "20",
            extra_value: 3,
            purchase_shipping: 4,
            switchStMode: true,
        });

        expect(result.totalWithoutTaxes).toBe(20);
        expect(result.ipiValue).toBeCloseTo(2);
        expect(result.totalWithIPI).toBeCloseTo(22);
        expect(result.stValue).toBeCloseTo(1.1);
        expect(result.totalWithIPIandST).toBeCloseTo(23.1);
        expect(result.markupValue).toBeCloseTo(4.62);
        expect(result.totalAfterMarkup).toBeCloseTo(27.72);
        expect(result.totalWithExtraValue).toBeCloseTo(30.72);
        expect(result.totalExtrasAndShipping).toBeCloseTo(7);
        expect(result.totalWithAll).toBeCloseTo(34.72);
        expect(result.finalUnitValue).toBeCloseTo(17.36);
    });
});
