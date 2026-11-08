import { describe, expect, it } from "vitest";
import { formatSqliteDateTime } from "./formatSqliteDateTime";

describe("formatSqliteDateTime", () => {
    it("separa a data e o horário e formata a data no padrão brasileiro", () => {
        expect(formatSqliteDateTime("2026-11-08 10:06:36", new Date(2026, 10, 8))).toEqual({
            date: "08/11/2026",
            time: "10:06:36",
            relative: "Hoje",
        });
    });

    it("formata ontem, dias passados e datas futuras com base no dia do calendário", () => {
        const now = new Date(2026, 10, 8, 0, 5);

        expect(formatSqliteDateTime("2026-11-07 23:59:59", now).relative).toBe("Ontem");
        expect(formatSqliteDateTime("2026-11-06 10:06:36", now).relative).toBe("há 2 dias");
        expect(formatSqliteDateTime("2026-07-31 10:06:36", now).relative).toBe("há 100 dias");
        expect(formatSqliteDateTime("2026-11-10 10:06:36", now).relative).toBe("em 2 dias");
    });

    it("rejeita valores fora do formato esperado", () => {
        expect(() => formatSqliteDateTime("08/11/2026 10:06")).toThrow(
            "Formato de data e hora inválido",
        );
        expect(() => formatSqliteDateTime("2026-02-30 10:06:36")).toThrow(
            "Formato de data e hora inválido",
        );
    });
});
