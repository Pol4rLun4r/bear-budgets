// mantine
import { Button, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Notes = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Button
                variant="default"
                radius="lg"
                onClick={open}
            >
                Notas
            </Button>
            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Notas/Anotações"
                radius='lg'
                size="lg"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Textarea
                    label="Notas sobre o item"
                    radius="lg"
                    placeholder="(opcional) sem anotações no momento"
                    autosize
                    minRows={10}
                    maxRows={20}
                />
            </Modal>
        </>
    )
}

export default Notes;