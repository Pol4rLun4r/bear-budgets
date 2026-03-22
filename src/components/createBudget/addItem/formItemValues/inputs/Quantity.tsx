// mantine
import { NumberInput } from "@mantine/core"

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"


const Quantity = () => {
    const dispatch = useDispatch<AppDispatch>();
    const quantity = useSelector((state: RootState) => state.createBudget.addItem.values.quantity);

    return (
        <NumberInput
            label="Quantidade"
            placeholder="00"
            withAsterisk
            radius='lg'

            min={1}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
    )
}

export default Quantity