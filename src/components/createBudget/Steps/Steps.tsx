// components
import CreateClient from "./createClient/CreateClient";

// styles
import classes from '../CreateBudget.module.css'

// mantine
import { Button, Stepper, Title, Text } from "@mantine/core"

// redux
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

const Steps = () => {
    const stepState = useSelector<RootState>((state) => state.createBudget.steps.step) as number;

    return (
        <div className={classes.stepsWrapper}>
            <Title>Criar Orçamento</Title>
            <Stepper active={stepState} style={{ width: '100%' }} mt={50}>
                <Stepper.Step label="Criar cliente">
                    <CreateClient />
                </Stepper.Step>
                {/* <Stepper.Step label="Definir cotação">
                    <Text>definir</Text>
                </Stepper.Step> */}
                <Stepper.Step label="Adicionar itens">
                    <Text>adicionar</Text>
                </Stepper.Step>
                <Stepper.Step label="Finalizar">
                    <Text>Finalizar</Text>
                </Stepper.Step>
            </Stepper>
            <Button
                mt={20}
                variant="gradient"
                radius='lg'
                type="submit"
                form={
                    stepState === 0 ?
                        'create-client-form' :
                        'other'
                }
            >
                Próximo
            </Button>
        </div>
    )
}

export default Steps