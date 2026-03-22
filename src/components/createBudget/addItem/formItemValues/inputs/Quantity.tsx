// mantine
import { NumberInput } from "@mantine/core"

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const Quantity = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <NumberInput
            w={'20%'}

            label="Quantidade"
            placeholder="00"
            withAsterisk
            radius='lg'

            min={1}

            decimalSeparator=","
            thousandSeparator="."

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={itemData.quantity}
            onChange={(value) => dispatch(setValues({ ...itemData, quantity: value as number }))}
        />
    )
}

export default Quantity