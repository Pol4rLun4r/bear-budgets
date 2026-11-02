import { describe, expect, it } from "vitest";

import { createChangeLogEntry } from "./changeLog.data";

describe("createChangeLogEntry", () => {
    it("parses calendar dates with one-based month numbers", () => {
        const { date } = createChangeLogEntry("Title", "Description", "2026-11-01");

        expect(date.getFullYear()).toBe(2026);
        expect(date.getMonth()).toBe(10);
        expect(date.getDate()).toBe(1);
    });

    it("rejects invalid calendar dates", () => {
        expect(() => createChangeLogEntry("Title", "Description", "2026-02-30"))
            .toThrow(RangeError);
    });
});
