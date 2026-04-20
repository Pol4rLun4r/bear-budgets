// mantine
import { ActionIcon, Button, Group, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { resetList } from "../../../redux/createBudget/items/listItemsSlice";

// components
import ItemForm from "../itemForm/@itemForm";
import SwitchMode from "./SwitchMode";

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
                        radius="lg"
                        variant="light"
                        color="var(--mantine-color-red-4)"

                        onClick={() => dispatch(resetList())}
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Tooltip>
                <SwitchMode/>
                <Tooltip label='Adicionar Item'>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        radius="lg"
                        variant="light"
                        onClick={open}
                    >
                        Item
                    </Button>
                </Tooltip>
            </Group>
            <Modal
                padding='xl'
                size='lg'
                opened={opened}
                onClose={close}
                title="Adicionar item"
                centered
                radius='lg'

                pos={"relative"}

                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <ItemForm scope="add" close={close} />
            </Modal>
        </>
    )
}

export default Buttons