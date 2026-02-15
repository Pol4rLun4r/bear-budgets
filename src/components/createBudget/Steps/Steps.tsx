// components
import CreateClient from "./CreateClient"

// styles
import classes from '../CreateBudget.module.css'
import { Stepper, Title } from "@mantine/core"

// mantine
import { Text } from "@mantine/core"

const Steps = () => {
    return (
        <div className={classes.stepsWrapper}>
            <Title>Criar Orçamento</Title>
            <Stepper active={0} style={{width: '100%'}} mt={50}>
                <Stepper.Step label="Criar cliente">
                    <CreateClient />
                </Stepper.Step>
                <Stepper.Step label="Adicionar itens">
                    <Text>adicionar</Text>
                </Stepper.Step>
                <Stepper.Step label="Finalizar">
                    <Text>Finalizar</Text>
                </Stepper.Step>
            </Stepper>  
        </div>
    )
}

export default Steps