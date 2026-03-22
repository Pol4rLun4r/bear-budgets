// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const ST = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <NumberInput
            label="ST"
            placeholder="(opcional)"
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
            value={itemData.st}
            onChange={(value) => dispatch(setValues({ ...itemData, st: value as number }))}
        />
    )
}

export default ST