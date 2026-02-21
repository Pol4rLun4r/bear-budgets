// components
import CreateClient from "./createClient/CreateClient";
import StepsButtons from "./stepsButtons/StepsButtons";
import StartBudget from "./startBudget/StartBudget";
import AddItems from "./addItems/AddItems";

// styles
import classes from './Steps.module.css';

// mantine
import { Stepper, Title, Text } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

const Steps = () => {
    const stepState = useSelector<RootState>((state) => state.createBudget.steps.step) as number;

    return (
        <div className={classes.container}>
            <Title className={classes.title}>Criar Orçamento</Title>
            <Stepper
                active={stepState}
                classNames={{
                    root: classes.root,
                    content: classes.content,
                    steps: classes.steps
                }}
            >
                <Stepper.Step label="Passo: 1" description="Criar cliente">
                    <CreateClient />
                </Stepper.Step>
                <Stepper.Step label="Passo: 2" description="Iniciar orçamento">
                    <StartBudget/>
                </Stepper.Step>
                <Stepper.Step label="Passo: 3" description="Adicionar Itens">
                    <AddItems/>
                </Stepper.Step>
                <Stepper.Completed>
                    <Text>Ajustes finais</Text>
                </Stepper.Completed>
            </Stepper>
            <StepsButtons />
        </div>
    )
}

export default Steps;