// components
import FormBasicData from "./formBasicData/@FormBasicData";
import FormItemValues from "./formItemValues/@FormItemValues";
import StepsButtons from "./StepsButtons";

// mantine
import { Stack, Stepper } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const AddItem = ({ close }: { close: () => void }) => {
    const step = useSelector((state: RootState) => state.createBudget.addItemSteps.step);

    return (
        <Stack gap="xl">
            <Stepper active={step} size="sm" radius="xl">
                <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
                    <FormBasicData />
                </Stepper.Step>
                <Stepper.Step label="Valores" description="Defina os valores do item">
                    <FormItemValues />
                </Stepper.Step>
            </Stepper>
            <StepsButtons close={close} />
        </Stack>
    )
}

export default AddItem