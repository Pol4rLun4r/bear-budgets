import { describe, expect, it } from "vitest";
import {
    businessDaysToCalendarDays,
    calendarDaysToBusinessDays,
    getDeliveryDate,
} from "./boardingUtils";

describe("getDeliveryDate", () => {
    it("soma dias corridos de embarque e dias úteis de entrega", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryDate(baseDate, 1, 1)).toEqual(new Date(2026, 9, 26));
    });

    it("retorna a data base quando não há dias de embarque nem de entrega", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryDate(baseDate, 0, 0)).toEqual(baseDate);
    });

    it("ignora feriados nacionais ao somar dias úteis", () => {
        const baseDate = new Date(2026, 9, 30);

        expect(getDeliveryDate(baseDate, 0, 1)).toEqual(new Date(2026, 10, 3));
    });

    it("converte dias úteis e corridos considerando feriados nacionais", () => {
        const baseDate = new Date(2026, 9, 30);

        expect(businessDaysToCalendarDays(baseDate, 1)).toBe(4);
        expect(calendarDaysToBusinessDays(baseDate, 4)).toBe(1);
    });
});
