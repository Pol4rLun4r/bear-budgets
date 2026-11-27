import { describe, expect, it } from "vitest";
import itemFormReducer, {
    resetItemValues,
    setValues,
    setValuesField,
} from "./itemForm.slice";

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

    describe("discount value fields", () => {
        it("changes the discount type without converting its value", () => {
            const scope = "item_form_add";
            const withValue = itemFormReducer(
                undefined,
                setValuesField({ scope, key: "discount_value", value: 100.2 }),
            );
            const withPercentageType = itemFormReducer(
                withValue,
                setValuesField({ scope, key: "discount_type", value: "percentage" }),
            );

            expect(withPercentageType.item_form_add.item_values).toMatchObject({
                discount_value: 100.2,
                discount_type: "percentage",
            });
        });
    });
});
