// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { ItemFormScope, setVersion } from "../../../../../redux/createBudget/items/itemFormSlice";

const ST = ({ scope }: { scope: ItemFormScope }) => {
    const itemValues = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_version);
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
            min={0.00}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={itemValues.st || ''}
            onChange={(value) =>
                dispatch(setVersion({ scope, version: { ...itemValues, st: value as number } }))
            }
        />
    )
}

export default ST