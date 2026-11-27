import { describe, expect, it } from "vitest";
import calcAddItem from "./calcAddItem";
import { getMarkupOptions } from "./markupList";

describe("custom markup options", () => {
    it("groups custom margins before standard percentages and shows all custom margins", () => {
        const margins = Array.from({ length: 20 }, (_, index) => ({
            id: `123e4567-e89b-42d3-a456-${String(index).padStart(12, "0")}`,
            name: `Atalho ${index + 1}`,
            percentage: 40,
        }));
        const options = getMarkupOptions(margins);

        expect(options[0]).toMatchObject({
            group: "Margens personalizadas",
            items: expect.arrayContaining([
                { label: "40% Atalho 1", value: `40.${margins[0].id}` },
                { label: "40% Atalho 20", value: `40.${margins[19].id}` },
            ]),
        });
        expect(options).toHaveLength(1);
    });

    it("fills the first ten options with standard percentages when there are fewer custom margins", () => {
        const options = getMarkupOptions([
            { id: "123e4567-e89b-42d3-a456-426614174000", name: "Revenda", percentage: 40 },
        ]);

        expect(options[0]?.items).toHaveLength(1);
        expect(options[1]?.items).toHaveLength(9);
        expect(options[1]?.items[8]).toEqual({
            label: "8% Markup",
            value: "8",
        });
    });

    it("includes a standard percentage when searching even if it is outside the initial list", () => {
        const options = getMarkupOptions([], "999");

        expect(options).toEqual([
            {
                group: "Margens padrão",
                items: [{ label: "999% Markup", value: "999" }],
            },
        ]);
    });

    it("keeps a selected standard percentage available after the search is cleared", () => {
        const options = getMarkupOptions([], "", "334");

        expect(options[0]?.items).toHaveLength(10);
        expect(options[0]?.items).toContainEqual({
            label: "334% Markup",
            value: "334",
        });
        expect(options[0]?.items?.[0]?.value).toBe("0");
    });

    it("keeps the selected standard percentage while preserving custom margin priority", () => {
        const options = getMarkupOptions(
            [{ id: "123e4567-e89b-42d3-a456-426614174000", name: "Revenda", percentage: 40 }],
            "",
            "334",
        );

        expect(options[0]?.items).toHaveLength(1);
        expect(options[1]?.items).toHaveLength(9);
        expect(options[1]?.items).toContainEqual({
            label: "334% Markup",
            value: "334",
        });
    });

    it("calculates a custom markup using its percentage, not its unique ID", () => {
        const result = calcAddItem({
            quantity: 1,
            unit_price: 100,
            markup: "40.123e4567-e89b-42d3-a456-426614174000",
        });

        expect(result.markupValue).toBe(40);
        expect(result.totalAfterMarkup).toBe(140);
    });
});
