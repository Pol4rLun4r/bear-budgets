// mantine
import { ActionIcon, Button, Group, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// components
import AddItem from "../addItem/@AddItem";

// icons
import { IconPlus, IconTrash } from "@tabler/icons-react"

const Buttons = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Group>
                <Tooltip label='Limpar lista' >
                    <ActionIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color="var(--mantine-color-red-4)"
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Tooltip>
                <Button
                    leftSection={<IconPlus size={20} />}
                    radius="md"
                    variant="light"
                    onClick={open}
                >
                    Adicionar Item
                </Button>
            </Group>
            <Modal
                padding='xl'
                size='lg'
                opened={opened}
                onClose={close}
                title="Adicione um item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <AddItem close={close} />
            </Modal>
        </>
    )
}

export default Buttons