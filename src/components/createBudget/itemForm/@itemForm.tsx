// components
import FormBasicData from "./formBasicData/@FormBasicData";
import FormItemValues from "./formItemValues/@FormItemValues";
import StepsButtons from "./StepsButtons";

// mantine
import { Stack, Stepper } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ItemFormScope } from "../../../redux/createBudget/items/itemFormSlice";

const ItemForm = ({ close, scope }: { close: () => void, scope: ItemFormScope }) => {
    const step = useSelector((state: RootState) => state.createBudget.itemFormSteps[scope].step);

    return (
        <Stack gap="xl">
            <Stepper active={step} size="sm" radius="xl">
                <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
                    <FormBasicData scope={scope} />
                </Stepper.Step>
                <Stepper.Step label="Valores" description="Defina os valores do item">
                    <FormItemValues scope={scope} />
                </Stepper.Step>
            </Stepper>
            <StepsButtons close={close} scope={scope} />
        </Stack>
    )
}

export default ItemForm;