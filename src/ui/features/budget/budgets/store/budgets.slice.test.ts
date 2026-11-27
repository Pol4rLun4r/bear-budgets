import { describe, expect, it } from "vitest";
import budgetsReducer, { setSearch, setStatusFilter } from "./budgets.slice";

describe("budgets list filters", () => {
    it("keeps the search and status filter in state", () => {
        const state = budgetsReducer(
            budgetsReducer(undefined, setSearch("obra")),
            setStatusFilter("1"),
        );

        expect(state).toEqual({ search: "obra", statusFilter: "1" });
    });

    it("clears the status filter without clearing the search", () => {
        const state = budgetsReducer(
            budgetsReducer(
                budgetsReducer(undefined, setSearch("obra")),
                setStatusFilter("1"),
            ),
            setStatusFilter(null),
        );

        expect(state).toEqual({ search: "obra", statusFilter: null });
    });
});
