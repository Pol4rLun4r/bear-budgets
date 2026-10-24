// mantine
import { Stack } from "@mantine/core";

// testes
import { useState } from "react";
import CurrencyInput from "@/shared/inputs/CurrencyInput";
import ItemForm from "./itemForm/@ItemForm";

const CreateBudget = () => {
  const [value, setValue] = useState<number | undefined>(1);

  return (
    <Stack gap={"xl"}>
      <CurrencyInput
        value={value}
        onValueChange={setValue}
        label="Valor unitário"
      />
      <ItemForm scope="item_form_add" />
      <ItemForm scope="item_form_edit" />
    </Stack>
  )
}

export default CreateBudget;