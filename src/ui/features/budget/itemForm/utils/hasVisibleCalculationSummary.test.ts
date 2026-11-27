import { describe, expect, it } from "vitest";
import { hasVisibleCalculationDetails } from "./hasVisibleCalculationSummary";

describe("hasVisibleCalculationDetails", () => {
    it("shows delivery estimate details when both delivery fields are visible", () => {
        expect(hasVisibleCalculationDetails(true, ["boarding", "delivery"])).toBe(true);
    });

    it("does not show delivery estimate details when only one delivery field is visible", () => {
        expect(hasVisibleCalculationDetails(true, ["delivery"])).toBe(false);
    });

    it("keeps details visible when a calculation detail field is visible", () => {
        expect(hasVisibleCalculationDetails(true, ["discount"])).toBe(true);
    });
});
