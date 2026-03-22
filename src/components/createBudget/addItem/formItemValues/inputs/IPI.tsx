// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const IPI = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <NumberInput
            label="IPI"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconPercentage size={18} />}

            decimalScale={2}
            decimalSeparator=","
            min={0}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={itemData.ipi}
            onChange={(value) => dispatch(setValues({ ...itemData, ipi: value as number }))}
        />
    )
}

export default IPI