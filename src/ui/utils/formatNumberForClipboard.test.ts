import { describe, expect, it } from "vitest";
import formatNumberForClipboard from "./formatNumberForClipboard";

describe("formatNumberForClipboard", () => {
    it("formats decimal numbers with a comma separator", () => {
        expect(formatNumberForClipboard(1243.22)).toBe("1243,22");
    });

    it("keeps two decimal places for whole numbers", () => {
        expect(formatNumberForClipboard(12)).toBe("12,00");
    });

    it("does not format non-finite numbers", () => {
        expect(formatNumberForClipboard(Number.NaN)).toBeUndefined();
        expect(formatNumberForClipboard(Number.POSITIVE_INFINITY)).toBeUndefined();
    });
});
