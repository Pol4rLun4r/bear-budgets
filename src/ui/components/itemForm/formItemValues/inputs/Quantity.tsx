// mantine
import { NumberInput } from "@mantine/core"

// redux
import { RootState, AppDispatch } from "../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { ItemFormScope, setValuesField } from "../../../../redux/itemForm/itemFormSlice";

const Quantity = ({ scope }: { scope: ItemFormScope }) => {
    const itemValues = useSelector((state: RootState) => state.itemForm.form[scope].item_values);
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
                dispatch(setValuesField({ scope, key: 'quantity', value }))
            }
        />
    )
}

export default Quantity