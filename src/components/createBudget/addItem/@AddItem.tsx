// components
import FormBasicData from "./formBasicData/@FormBasicData";
import FormItemValues from "./formItemValues/@FormItemValues";

// mantine
import { Stack, Stepper, Button, Group } from "@mantine/core";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { incrementStep, decrementStep } from "../../../redux/createBudget/items/addItemStepsSlice";

const AddItem = () => {
    const dispatch = useDispatch<AppDispatch>();

    const step = useSelector((state: RootState) => state.createBudget.addItemSteps.step);
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const itemValues = useSelector((state: RootState) => state.createBudget.addItem.values);

    const hasDescription = itemData.description.trim().length > 0;

    const hasValues = (itemValues.unit_price !== undefined || itemValues.unit_price! > 0  ) && (itemValues.quantity! > 0 || itemValues.quantity !== undefined) && (itemValues.markup !== undefined);

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
            {step === 0 ? (
                <Button
                    radius='lg'
                    variant="light"
                    onClick={() => dispatch(incrementStep())}
                    disabled={!hasDescription}
                >
                    Definir valores do item
                </Button>
            ) : (
                <Group grow>
                    <Button
                        radius='lg'
                        variant="default"
                        c='dimmed'
                        onClick={() => dispatch(decrementStep())}
                    >
                        Voltar
                    </Button>
                    <Button
                        radius='lg'
                        variant="light"
                        onClick={() => alert('item criado: fake')}
                        disabled={!hasValues}
                    >
                        Criar item
                    </Button>
                </Group>
            )}
        </Stack>
    )
}

export default AddItem