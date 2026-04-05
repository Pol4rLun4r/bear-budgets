// mantine
import { NumberInput } from "@mantine/core"

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { ItemFormScope, setValues } from "../../../../../redux/createBudget/items/itemFormSlice";

const Quantity = ({ scope }: { scope: ItemFormScope }) => {
    const itemValues = useSelector((state: RootState) => state.createBudget.itemForm[scope].values);
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
            value={itemValues.quantity || ''}
            onChange={(value) =>
                dispatch(setValues({ scope, values: { ...itemValues, quantity: value as number } }))
            }
        />
    )
}

export default Quantity