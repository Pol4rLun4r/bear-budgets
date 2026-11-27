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

    it("subtracts a fixed discount after additions", () => {
        const result = calcAddItem({
            quantity: 2,
            unit_price: 10,
            markup: "20",
            extra_value: 3,
            purchase_shipping: 4,
            discount_value: 5.25,
            discount_type: "fixed",
        });

        expect(result.totalBeforeDiscount).toBeCloseTo(31);
        expect(result.discountValue).toBe(5.25);
        expect(result.totalWithAll).toBeCloseTo(25.75);
        expect(result.finalUnitValue).toBeCloseTo(12.875);
    });

    it("calculates a percentage discount on the total including additions", () => {
        const result = calcAddItem({
            quantity: 2,
            unit_price: 10,
            markup: "20",
            extra_value: 3,
            purchase_shipping: 4,
            discount_value: 10.33,
            discount_type: "percentage",
        });

        expect(result.totalBeforeDiscount).toBeCloseTo(31);
        expect(result.discountValue).toBe(3.2);
        expect(result.totalWithAll).toBeCloseTo(27.8);
    });

    it("caps the applied discount at the total without changing the entered value", () => {
        const result = calcAddItem({
            quantity: 1,
            unit_price: 20,
            markup: "0",
            discount_value: 125,
            discount_type: "percentage",
        });

        expect(result.discountValue).toBe(20);
        expect(result.totalWithAll).toBe(0);
    });
});
