import { describe, expect, it } from "vitest";
import { createEmptyItemData } from "../../itemForm/store/itemForm.slice";
import itemTableReducer, {
    addItem,
    cycleAllItemTags,
    deleteItem,
    dilutePurchaseShipping,
    replaceItemMarkup,
    resetItemTags,
    resetTable,
    setItemTag,
    setItemTable,
    setTagEditingEnabled,
} from "./itemTable.slice";

const createPricedItem = (unitPrice: number) => {
    const item = createEmptyItemData();
    item.item_values.unit_price = unitPrice;
    return item;
};

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

    it("distributes freight by final total and replaces existing freight", () => {
        const scope = "budget_form_create";
        const firstItem = createPricedItem(100);
        firstItem.item_values.purchase_shipping = 2;
        const withFirstItem = itemTableReducer(
            undefined,
            addItem({ scope, data: firstItem }),
        );
        const withSecondItem = itemTableReducer(
            withFirstItem,
            addItem({ scope, data: createPricedItem(100) }),
        );
        const withThreeItems = itemTableReducer(
            withSecondItem,
            addItem({ scope, data: createPricedItem(100) }),
        );

        const updatedState = itemTableReducer(
            withThreeItems,
            dilutePurchaseShipping({ scope, amount: 10, target: "all" }),
        );

        expect(updatedState[scope].map((item) => item.item_values.purchase_shipping)).toEqual([
            3.36,
            3.32,
            3.32,
        ]);
    });

    it("weights freight by each item's final total and replaces current shipping", () => {
        const scope = "budget_form_create";
        const firstItem = createPricedItem(100);
        firstItem.item_values.ipi = 10;
        firstItem.item_values.st = 5;
        firstItem.item_values.markup = "200";
        firstItem.item_values.extra_value = 100;
        firstItem.item_values.purchase_shipping = 7;

        const secondItem = createPricedItem(200);
        secondItem.item_values.markup = "10";
        secondItem.item_values.extra_value = 1000;
        secondItem.item_values.purchase_shipping = 8;

        const withFirstItem = itemTableReducer(
            undefined,
            addItem({ scope, data: firstItem }),
        );
        const withBothItems = itemTableReducer(
            withFirstItem,
            addItem({ scope, data: secondItem }),
        );

        const updatedState = itemTableReducer(
            withBothItems,
            dilutePurchaseShipping({ scope, amount: 31.5, target: "all" }),
        );

        expect(updatedState[scope].map((item) => item.item_values.purchase_shipping)).toEqual([
            8.48,
            23.02,
        ]);
    });

    it("distributes freight only across items with the selected tag", () => {
        const scope = "budget_form_create";
        const withFirstItem = itemTableReducer(
            undefined,
            addItem({ scope, data: createPricedItem(100) }),
        );
        const withSecondItem = itemTableReducer(
            withFirstItem,
            addItem({ scope, data: createPricedItem(100) }),
        );
        const withThirdItem = itemTableReducer(
            withSecondItem,
            addItem({ scope, data: createPricedItem(100) }),
        );
        const withFourthItem = itemTableReducer(
            withThirdItem,
            addItem({ scope, data: createPricedItem(100) }),
        );
        const [first, second, third, fourth] = withFourthItem[scope];
        const taggedFirst = itemTableReducer(
            withFourthItem,
            setItemTag({ scope, itemId: first.temp_id, tag: 1 }),
        );
        const taggedSecond = itemTableReducer(
            taggedFirst,
            setItemTag({ scope, itemId: second.temp_id, tag: 2 }),
        );
        const taggedThird = itemTableReducer(
            taggedSecond,
            setItemTag({ scope, itemId: third.temp_id, tag: 1 }),
        );
        const taggedState = itemTableReducer(
            taggedThird,
            setItemTag({ scope, itemId: fourth.temp_id, tag: 3 }),
        );

        const updatedState = itemTableReducer(
            taggedState,
            dilutePurchaseShipping({ scope, amount: 5, target: "green" }),
        );

        expect(updatedState[scope].map((item) => item.item_values.purchase_shipping)).toEqual([
            2.5,
            undefined,
            2.5,
            undefined,
        ]);
    });

    it.each([
        ["neutral", "neutral", 0],
        ["yellow", "yellow", 2],
        ["red", "red", 3],
    ] as const)("supports the %s tag filter", (_label, target, tag) => {
        const scope = "budget_form_create";
        let state = itemTableReducer(
            undefined,
            addItem({ scope, data: createPricedItem(100) }),
        );
        for (let index = 1; index < 4; index += 1) {
            state = itemTableReducer(
                state,
                addItem({ scope, data: createPricedItem(100) }),
            );
        }

        const tags = [0, 1, 2, 3] as const;
        state[scope].forEach((item, index) => {
            state = itemTableReducer(
                state,
                setItemTag({ scope, itemId: item.temp_id, tag: tags[index] }),
            );
        });

        const updatedState = itemTableReducer(
            state,
            dilutePurchaseShipping({ scope, amount: 8, target }),
        );

        expect(updatedState[scope].map((item) => item.item_values.purchase_shipping)).toEqual(
            tags.map((itemTag) => itemTag === tag ? 8 : undefined),
        );
    });

    it("does not change items when the amount is invalid or no items match", () => {
        const scope = "budget_form_create";
        const state = itemTableReducer(
            undefined,
            addItem({ scope, data: createPricedItem(100) }),
        );

        const invalidAmountState = itemTableReducer(
            state,
            dilutePurchaseShipping({ scope, amount: 0, target: "all" }),
        );
        const noMatchingItemsState = itemTableReducer(
            state,
            dilutePurchaseShipping({ scope, amount: 10, target: "red" }),
        );

        expect(invalidAmountState[scope][0].item_values.purchase_shipping).toBeUndefined();
        expect(noMatchingItemsState[scope][0].item_values.purchase_shipping).toBeUndefined();
    });

    it("does not change items when all selected final totals are zero", () => {
        const scope = "budget_form_create";
        const item = createEmptyItemData();
        const state = itemTableReducer(
            undefined,
            addItem({ scope, data: item }),
        );

        const updatedState = itemTableReducer(
            state,
            dilutePurchaseShipping({ scope, amount: 20, target: "all" }),
        );

        expect(updatedState[scope][0].item_values.purchase_shipping).toBeUndefined();
    });

    it("replaces markup only for items matching the selected tag", () => {
        const scope = "budget_form_create";
        let state = itemTableReducer(
            undefined,
            addItem({ scope, data: createPricedItem(100) }),
        );
        state = itemTableReducer(
            state,
            addItem({ scope, data: createPricedItem(200) }),
        );
        state[scope].forEach((item, index) => {
            state = itemTableReducer(
                state,
                setItemTag({ scope, itemId: item.temp_id, tag: index === 0 ? 1 : 2 }),
            );
        });

        const updatedState = itemTableReducer(
            state,
            replaceItemMarkup({ scope, markup: "75", target: "green" }),
        );

        expect(updatedState[scope].map((item) => item.item_values.markup)).toEqual(["75", "40"]);
        expect(updatedState[scope].map((item) => item.item_values.unit_price)).toEqual([100, 200]);
    });

    it("replaces markup on every item for the all-items target", () => {
        const scope = "budget_form_create";
        let state = itemTableReducer(
            undefined,
            addItem({ scope, data: createPricedItem(100) }),
        );
        state = itemTableReducer(
            state,
            addItem({ scope, data: createPricedItem(200) }),
        );

        const updatedState = itemTableReducer(
            state,
            replaceItemMarkup({ scope, markup: "0", target: "all" }),
        );

        expect(updatedState[scope].map((item) => item.item_values.markup)).toEqual(["0", "0"]);
    });

    it.each(["", "-1", "1001", "1.5", "invalid"])(
        "does not replace markup with invalid value %s",
        (markup) => {
            const scope = "budget_form_create";
            const item = createPricedItem(100);
            item.item_values.markup = "40";
            const state = itemTableReducer(
                undefined,
                addItem({ scope, data: item }),
            );

            const updatedState = itemTableReducer(
                state,
                replaceItemMarkup({ scope, markup, target: "all" }),
            );

            expect(updatedState[scope][0].item_values.markup).toBe("40");
        },
    );
});
