// components
import CurrencyInput from "@/shared/inputs/CurrencyInput";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setValuesField, type ItemFormScope } from "../../../store/itemForm.slice";

const UnitValue = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.itemForm.form[scope].item_values.unit_price);

    return (
        <CurrencyInput
            value={value}
            onValueChange={(value) =>
                dispatch(setValuesField({ scope, key: "unit_price", value }))
            }
            label="Valor unitário"
            placeholder="00"
            withAsterisk
            width={"30%"}
        />
    )
}

export default UnitValue
