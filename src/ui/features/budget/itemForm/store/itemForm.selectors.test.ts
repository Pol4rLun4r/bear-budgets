import { describe, expect, it } from "vitest";
import { hasHiddenItemReferenceContent } from "./hiddenItemReferenceContent";

describe("hasHiddenItemReferenceContent", () => {
    it("detects non-empty hidden reference fields", () => {
        expect(
            hasHiddenItemReferenceContent(
                { internal_code: "ABC-123" },
                [],
                undefined,
                [],
            ),
        ).toBe(true);
    });

    it("does not warn when populated fields are visible", () => {
        expect(
            hasHiddenItemReferenceContent(
                { notes: "Observação" },
                [],
                undefined,
                ["notes"],
            ),
        ).toBe(false);
    });

    it("detects saved or pending links when links are hidden", () => {
        expect(
            hasHiddenItemReferenceContent(
                {},
                [{ content: "https://example.com/item" }],
                undefined,
                [],
            ),
        ).toBe(true);
        expect(
            hasHiddenItemReferenceContent({}, [], "https://example.com/item", []),
        ).toBe(true);
    });

    it("ignores empty or whitespace-only hidden fields", () => {
        expect(
            hasHiddenItemReferenceContent(
                { internal_code: "  ", notes: "" },
                [{ content: "  " }],
                undefined,
                [],
            ),
        ).toBe(false);
    });
});
