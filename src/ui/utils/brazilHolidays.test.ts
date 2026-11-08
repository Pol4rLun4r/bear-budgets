import { describe, expect, it } from "vitest";
import { getBrazilNationalHolidays } from "./brazilHolidays";

describe("getBrazilNationalHolidays", () => {
    it("returns national holidays for the requested year in YYYY-MM-DD format", () => {
        expect(getBrazilNationalHolidays(2026)).toEqual([
            { date: "2026-01-01", name: "Confraternização Universal", scope: "national" },
            { date: "2026-04-21", name: "Tiradentes", scope: "national" },
            { date: "2026-05-01", name: "Dia do Trabalho", scope: "national" },
            { date: "2026-09-07", name: "Independência do Brasil", scope: "national" },
            { date: "2026-10-12", name: "Nossa Senhora Aparecida", scope: "national" },
            { date: "2026-11-02", name: "Finados", scope: "national" },
            { date: "2026-11-15", name: "Proclamação da República", scope: "national" },
            {
                date: "2026-11-20",
                name: "Dia Nacional de Zumbi e da Consciência Negra",
                scope: "national",
            },
            { date: "2026-12-25", name: "Natal", scope: "national" },
        ]);
    });

    it("rejects years outside the supported range", () => {
        expect(() => getBrazilNationalHolidays(0)).toThrow(RangeError);
        expect(() => getBrazilNationalHolidays(2026.5)).toThrow(RangeError);
    });
});
