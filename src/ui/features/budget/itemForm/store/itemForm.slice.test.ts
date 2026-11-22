import { describe, expect, it } from "vitest";
import itemFormReducer, { resetItemValues, setValues } from "./itemForm.slice";

describe("resetItemValues", () => {
    it("clears editable values while preserving the persisted item's identity and position", () => {
        const scope = "item_form_edit";
        const state = itemFormReducer(
            undefined,
            setValues({
                scope,
                values: {
                    id: 17,
                    item_reference_id: 23,
                    position: 2,
                    quantity: 5,
                    unit_price: 10,
                },
            }),
        );

        const updatedState = itemFormReducer(state, resetItemValues(scope));

        expect(updatedState.item_form_edit.item_values).toMatchObject({
            id: 17,
            item_reference_id: 23,
            position: 2,
            quantity: 1,
            unit_price: undefined,
        });
    });
});
