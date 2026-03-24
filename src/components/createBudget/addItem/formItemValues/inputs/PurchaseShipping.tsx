// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const PurchaseShipping = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
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
            value={itemData.purchase_freight}
            onChange={(value) => dispatch(setValues({ ...itemData, purchase_freight: value as number }))}
        />
    )
}

export default PurchaseShipping