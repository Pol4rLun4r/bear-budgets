// mantine
import { Stack } from "@mantine/core";

// testes
import { useState } from "react";
import CurrencyInput from "@/shared/inputs/CurrencyInput";
import Description from "./itemForm/components/itemReference/inputs/description/@Description";

const CreateBudget = () => {
  const [value, setValue] = useState<number | undefined>(1);

  return (
    <Stack>
      <CurrencyInput
        value={value}
        onValueChange={setValue}
        label="Valor unitário"
      />
      <Description/>
    </Stack>
  )
}

export default CreateBudget;