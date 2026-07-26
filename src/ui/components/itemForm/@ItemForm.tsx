// components
import FormItemReference from "./formItemReference/@FormItemReference";
import FormItemValues from "./formItemValues/@FormItemValues";
import StepsButtons from "./StepsButtons";
import SwitchMode from "./SwitchMode";

// mantine
import { Divider, Stack, Stepper } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemFormScope } from "../../redux/itemForm/itemFormSlice";

// components
import WarningMoreValues from "./WarningMoreValues";

const ItemForm = ({ close, scope }: { close: () => void, scope: ItemFormScope }) => {
    const step = useSelector((state: RootState) => state.itemForm.steps[scope].step);

    return (
        <Stack gap="xl">
            <SwitchMode />
            <WarningMoreValues scope={scope} />
            <Stepper active={step} size="sm" radius="xl">
                <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
                    <FormItemReference scope={scope} />
                </Stepper.Step>
                <Stepper.Step label="Valores" description="Defina os valores do item">
                    <FormItemValues scope={scope} />
                </Stepper.Step>
            </Stepper>
            <Divider />
            <StepsButtons close={close} scope={scope} />
        </Stack>
    )
}

export default ItemForm;