// mantine
import { Stack } from "@mantine/core";

// testes
import ItemForm from "./itemForm/@ItemForm";

const CreateBudget = () => {

  return (
    <Stack gap={"xl"}>
      <ItemForm scope="item_form_add" />
    </Stack>
  )
}

export default CreateBudget;