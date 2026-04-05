// mantine
import { ActionIcon, Button, Group, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { resetList } from "../../../redux/createBudget/items/listItemsSlice";

// components
import AddItem from "../itemForm/@itemForm";

// icons
import { IconPlus, IconTrash } from "@tabler/icons-react"

const Buttons = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <>
            <Group>
                <Tooltip label='Limpar lista' >
                    <ActionIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color="var(--mantine-color-red-4)"

                        onClick={() => dispatch(resetList())}
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
                <AddItem scope="add" close={close} />
            </Modal>
        </>
    )
}

export default Buttons