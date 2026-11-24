import { describe, expect, it } from "vitest";
import { createEmptyItemData } from "../../itemForm/store/itemForm.slice";
import itemTableReducer, {
    addItem,
    cycleAllItemTags,
    deleteItem,
    resetItemTags,
    resetTable,
    setItemTag,
    setItemTable,
    setTagEditingEnabled,
} from "./itemTable.slice";

describe("item table tags", () => {
    it("stores tag selections in item values", () => {
        const scope = "budget_form_create";
        const state = itemTableReducer(
            undefined,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const item = state[scope][0];

        const updatedState = itemTableReducer(
            state,
            setItemTag({ scope, itemId: item.temp_id, tag: 3 }),
        );

        expect(updatedState[scope][0].item_values.tag).toBe(3);
    });

    it("clears the tag and editing state when the table is reset", () => {
        const scope = "budget_form_create";
        const state = itemTableReducer(
            undefined,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const item = state[scope][0];
        const updatedState = itemTableReducer(
            itemTableReducer(
                itemTableReducer(
                    state,
                    setTagEditingEnabled({ scope, enabled: true }),
                ),
                setItemTag({ scope, itemId: item.temp_id, tag: 2 }),
            ),
            resetTable(scope),
        );

        expect(updatedState[scope]).toEqual([]);
        expect(updatedState.tagEditingEnabled[scope]).toBe(false);
    });

    it("removes an item and its tag from the table", () => {
        const scope = "budget_form_create";
        const state = itemTableReducer(
            undefined,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const item = state[scope][0];
        const updatedState = itemTableReducer(
            itemTableReducer(
                state,
                setItemTag({ scope, itemId: item.temp_id, tag: 1 }),
            ),
            deleteItem({ scope, tempItemId: item.temp_id }),
        );

        expect(updatedState[scope]).toEqual([]);
    });

    it("cycles all item tags while preserving their relative states", () => {
        const scope = "budget_form_create";
        const withFirstItem = itemTableReducer(
            undefined,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const withTwoItems = itemTableReducer(
            withFirstItem,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const [firstItem, secondItem] = withTwoItems[scope];
        const customTagState = itemTableReducer(
            itemTableReducer(
                withTwoItems,
                setItemTag({ scope, itemId: firstItem.temp_id, tag: 1 }),
            ),
            setItemTag({ scope, itemId: secondItem.temp_id, tag: 3 }),
        );

        const updatedState = itemTableReducer(
            customTagState,
            cycleAllItemTags(scope),
        );

        expect(updatedState[scope].map((item) => item.item_values.tag)).toEqual([2, 0]);
    });

    it("resets all item tags to zero without changing checkbox visibility", () => {
        const scope = "budget_form_create";
        const withFirstItem = itemTableReducer(
            undefined,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const withTwoItems = itemTableReducer(
            withFirstItem,
            addItem({ scope, data: createEmptyItemData() }),
        );
        const [firstItem, secondItem] = withTwoItems[scope];
        const taggedState = itemTableReducer(
            itemTableReducer(
                itemTableReducer(
                    withTwoItems,
                    setTagEditingEnabled({ scope, enabled: true }),
                ),
                setItemTag({ scope, itemId: firstItem.temp_id, tag: 2 }),
            ),
            setItemTag({ scope, itemId: secondItem.temp_id, tag: 3 }),
        );

        const updatedState = itemTableReducer(taggedState, resetItemTags(scope));

        expect(updatedState[scope].map((item) => item.item_values.tag)).toEqual([0, 0]);
        expect(updatedState.tagEditingEnabled[scope]).toBe(true);
    });

    it("loads stored item tags and defaults missing tags to zero", () => {
        const taggedItem = createEmptyItemData();
        taggedItem.item_values.tag = 2;
        const state = itemTableReducer(
            itemTableReducer(
                undefined,
                setTagEditingEnabled({ scope: "budget_form_edit", enabled: true }),
            ),
            setItemTable({
                scope: "budget_form_edit",
                data: [taggedItem, createEmptyItemData()],
            }),
        );

        expect(state.budget_form_edit.map((item) => item.item_values.tag)).toEqual([2, 0]);
        expect(state.tagEditingEnabled.budget_form_edit).toBe(true);
    });
});
