// mantine
import { Button, Center, Divider, Paper, Stack, Text } from "@mantine/core"

// style
import classes from './AddItems.module.css'

// icons
import { IconCirclePlus } from "@tabler/icons-react"

interface FormDataType {
    handleSubmit?: any
}

const List = () => {
    return (
        <form>
            <Paper withBorder radius='md' className={classes.form}>
                <Center>
                    <Button size="md" leftSection={<IconCirclePlus />} radius={'md'} variant="light">Adiciona item</Button>
                </Center>
                <Divider mt='md' mb='md' />
                <Stack mih={200} align="center" justify="center">
                        <Text c='dimmed'>Lista de itens vazia</Text>
                </Stack>
            </Paper>
        </form>
    )
}

export default List