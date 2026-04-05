// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { ItemFormScope, setValues } from "../../../../../redux/createBudget/items/itemFormSlice";

const PurchaseShipping = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <NumberInput
            label="Frete de compra"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconCurrencyReal size={18} />}

            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            min={0.00}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={itemData.purchase_shipping || ''}
            onChange={(value) =>
                dispatch(setValues({ scope, values: { ...itemData, purchase_shipping: value as number } }))
            }
        />
    )
}

export default PurchaseShipping