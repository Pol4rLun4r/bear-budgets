// react
import { useState } from "react";

// components
import FormBasicData from "./inputs/FormBasicData";
import Values from "./inputs/Values/Values";

// mantine
import { Stack, Stepper, Button, Group } from "@mantine/core";

const AddItem = () => {
    const [active, setActive] = useState(0);

    return (
        <Stack gap="xl">
            <Stepper active={active} size="sm" radius="xl">
                <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
                    <FormBasicData />
                </Stepper.Step>
                <Stepper.Step label="Valores" description="Defina os valores do item">
                    <Values />
                </Stepper.Step>
            </Stepper>
            {active === 0 ? (
                <Button
                    radius='lg'
                    variant="light"
                    onClick={() => setActive(1)}
                >
                    Definir valores do item
                </Button>
            ) : (
                <Group grow>
                    <Button
                        radius='lg'
                        variant="default"
                        c='dimmed'
                        onClick={() => setActive(0)}
                    >
                        Voltar
                    </Button>
                    <Button
                        radius='lg'
                        variant="light"
                        onClick={() => alert('item criado: fake') }
                    >
                        Criar item
                    </Button>
                </Group>
            )}

        </Stack>
    )
}

export default AddItem