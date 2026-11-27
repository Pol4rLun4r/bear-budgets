import { Group } from "@mantine/core";
import CurrencyInput from "@/shared/inputs/CurrencyInput";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setValuesField, type ItemFormScope } from "../../../store/itemForm.slice";
import DiscountTypeToggle from "./DiscountTypeToggle";

const Discount = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const itemValues = useAppSelector((state) => state.itemForm.form[scope].item_values);
    const discountType = itemValues.discount_type ?? "fixed";

    return (
        <Group
            align="flex-end"
            gap="xs"
            wrap="nowrap"
            style={{ width: "100%" }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <CurrencyInput
                    width="100%"
                    value={itemValues.discount_value}
                    onValueChange={(value) =>
                        dispatch(setValuesField({ scope, key: "discount_value", value }))
                    }
                    label="Desconto"
                    placeholder="(opcional)"
                    mode={discountType === "percentage" ? "percentage" : "currency"}
                />
            </div>
            <DiscountTypeToggle
                value={discountType}
                onChange={(value) =>
                    dispatch(setValuesField({ scope, key: "discount_type", value }))
                }
            />
        </Group>
    );
};

export default Discount;
