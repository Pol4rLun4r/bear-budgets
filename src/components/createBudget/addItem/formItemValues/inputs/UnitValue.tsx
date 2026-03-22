// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const UnitValue = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <NumberInput
            w={'30%'}

            label="Valor unitário"
            placeholder="00,00"
            withAsterisk
            radius='lg'

            leftSection={<IconCurrencyReal size={18} />}

            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            fixedDecimalScale
            min={0.00}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={itemData.unit_price}
            onChange={(value) => dispatch(setValues({ ...itemData, unit_price: value as number }))}
        />
    )
}

export default UnitValue