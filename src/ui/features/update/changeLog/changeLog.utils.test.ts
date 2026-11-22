import { describe, expect, it } from "vitest";

import { createChangeLogEntry } from "./changeLog.data";
import {
    formatChangeLogDate,
    formatChangeLogGroupDate,
    groupChangeLogEntries,
} from "./changeLog.utils";

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

describe("changeLog date groups", () => {
    it("formats date group headings", () => {
        expect(formatChangeLogGroupDate(new Date(2026, 10, 18))).toBe("18/11/2026");
    });

    it("sorts entries by day and groups entries from the same day", () => {
        const older = createChangeLogEntry("Older", "Description", "2026-11-10");
        const firstRecent = createChangeLogEntry("First recent", "Description", "2026-11-18");
        const middle = createChangeLogEntry("Middle", "Description", "2026-11-12");
        const secondRecent = createChangeLogEntry("Second recent", "Description", "2026-11-18");

        const groups = groupChangeLogEntries([older, firstRecent, middle, secondRecent]);

        expect(groups).toHaveLength(3);
        expect(groups[0].entries.map(({ title }) => title)).toEqual([
            "First recent",
            "Second recent",
        ]);
        expect(groups[1].entries.map(({ title }) => title)).toEqual(["Middle"]);
        expect(groups[2].entries.map(({ title }) => title)).toEqual(["Older"]);
    });
});
