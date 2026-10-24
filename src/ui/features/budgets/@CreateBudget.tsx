// mantine
import { Button, Modal, Stack } from "@mantine/core";

// testes
import ItemForm from "./itemForm/@ItemForm";
import { useDisclosure } from "@mantine/hooks";

const CreateBudget = () => {
  const [itemOpened, { open: itemOpen, close: itemClose }] = useDisclosure(false);


  return (
    <Stack gap={"xl"}>
      <Button onClick={itemOpen}>
        Abrir modal
      </Button>

      < Modal
        padding='xl'
        size='lg'
        opened={itemOpened}
        onClose={itemClose}
        title="Adicionar item"
        centered
        radius='lg'

        pos={"relative"}

        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <ItemForm scope={'item_form_edit'} closeModal={itemClose} />
      </Modal >
    </Stack>
  )
}

export default CreateBudget;