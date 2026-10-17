// mantine
import { Switch, Tooltip } from "@mantine/core"

// redux
import type { AppDispatch, RootState } from "../../../../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { setModeOff, setModeOn } from "../../../../redux/budgetForm/items/listItemsSwitchModeSlice"

const SwitchMode = () => {
    const dispatch = useDispatch<AppDispatch>();
    const switchMode = useSelector((state: RootState) => state.budgetForm.listItemsSwitchMode.mode);

    const handleSwitch = (mode: boolean) => {
        if (!mode) {
            return dispatch(setModeOff())
        }
        return dispatch(setModeOn())
    }

    return (
        <Tooltip label="Modo Simples" refProp="rootRef">
            <Switch
                size="xl"
                onLabel="On"
                offLabel="Off"
                radius="lg"

                checked={switchMode}
                onChange={(event) => handleSwitch(event.currentTarget.checked)}
            />
        </Tooltip>
    )
}

export default SwitchMode