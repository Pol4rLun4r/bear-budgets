// mantine
import { Menu } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setMode } from "../../../store/itemTableSwitch.slice";

const SwitchMode = () => {
    const dispatch = useAppDispatch();
    const switchMode = useAppSelector((state) => state.budgetForm.itemTableSwitch.mode);

    return (
        <Menu.CheckboxItem
            checked={switchMode}
            color={switchMode ? "teal" : undefined}
            onChange={(mode) => dispatch(setMode(mode))}
        >
            Modo simples
        </Menu.CheckboxItem>
    )
}

export default SwitchMode