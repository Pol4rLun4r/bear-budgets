// mantine
import { NumberInput } from "@mantine/core"

// redux
import { getItemFormState } from "../../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Quantity = ({ scope }: { scope: ItemFormScope }) => {
    const { item_values } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

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
            value={item_values.quantity || ''}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'quantity', value }))
            }
        />
    )
}

export default Quantity