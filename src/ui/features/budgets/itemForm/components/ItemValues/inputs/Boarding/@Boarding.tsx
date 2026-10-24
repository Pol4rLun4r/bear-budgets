// components
import BoardingInput from "./BoardingInput";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "@/features/budgets/itemForm/store/itemForm.slice";
import { getItemFormState } from "@/features/budgets/itemForm/store/itemForm.selectors";

const Boarding = ({ scope }: { scope: ItemFormScope }) => {
    const { item_values } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

    const baseDate = new Date();

    return (
        <BoardingInput
            baseDate={baseDate}
            onChange={(value) => dispatch(setValuesField({ scope, key: 'boarding', value }))}
            value={item_values.boarding ?? 0}
        />
    )
}

export default Boarding;