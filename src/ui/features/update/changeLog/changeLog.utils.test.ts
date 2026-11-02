import { describe, expect, it } from "vitest";

import { formatChangeLogDate } from "./changeLog.utils";

describe("formatChangeLogDate", () => {
    const now = new Date(2026, 10, 1);

    it("shows a relative date for recent entries", () => {
        expect(formatChangeLogDate(new Date(2026, 9, 21), now)).toBe("há 11 dias");
    });

    it("shows only the full date for entries older than one month", () => {
        expect(formatChangeLogDate(new Date(2026, 8, 30), now)).toBe("30/09/2026");
    });

    it("keeps the relative date on the one-month boundary", () => {
        expect(formatChangeLogDate(new Date(2026, 9, 1), now)).toBe("há 31 dias");
    });
});
