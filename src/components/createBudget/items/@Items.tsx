// mantine
import { Paper, Stack, Text } from "@mantine/core"

// components
import ItemsBar from '../itemsBar/@ItemsBar';

// style
import classes from './Items.module.css';

// icon
import { IconInvoice } from "@tabler/icons-react";

const Items = () => {
    return (
        <Stack mt="lg" className={classes.container}>
            <ItemsBar/>
            <Paper withBorder radius="lg" className={classes.items}>
                <Stack align="center">
                    <IconInvoice size={100} stroke={1} color="var(--mantine-color-dimmed)" />
                    <Text size="lg" c="var(--mantine-color-dimmed)" >Nenhum item adicionado no momento.</Text>
                </Stack>
            </Paper>
        </Stack>
    )
}

export default Items