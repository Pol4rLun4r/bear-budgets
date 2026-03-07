// mantine
import { Modal, Button, Center, Divider, Paper, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

// style
import classes from './AddItems.module.css'

// components
import NewItem from "./NewItem"

// icons
import { IconCirclePlus } from "@tabler/icons-react"

interface FormDataType {
    handleSubmit?: any
}

const List = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <form>
                <Paper withBorder radius='md' className={classes.form}>
                    <Center>
                        <Button size="md" leftSection={<IconCirclePlus />} radius={'md'} variant="light" onClick={open}>Adicionar item</Button>
                    </Center>
                    <Divider mt='md' mb='md' />
                    <Stack mih={200} align="center" justify="center">
                        <Text c='dimmed'>Lista de itens vazia</Text>
                    </Stack>
                </Paper>
            </form>
            <Modal
                padding='xl'
                size='lg'
                opened={opened}
                onClose={close}
                title="Adicione um item"
                centered
                radius='md'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <NewItem />
            </Modal>
        </>
    )
}

export default List