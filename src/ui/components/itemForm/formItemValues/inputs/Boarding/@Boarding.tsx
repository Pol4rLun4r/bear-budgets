// components
import BoardingInput from "./BoardingInput";

// redux
import { ItemFormScope, setValuesField } from "../../../../../redux/itemForm/itemFormSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";

const Boarding = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.itemForm.form[scope].item_values);
    const dispatch = useDispatch<AppDispatch>();

    const baseDate = new Date();

    return (
        <BoardingInput
            baseDate={baseDate}
            onChange={(value) => dispatch(setValuesField({ scope, key: 'boarding', value }))}
            value={itemData.boarding ?? 7}
        />
    )
}

export default Boarding;