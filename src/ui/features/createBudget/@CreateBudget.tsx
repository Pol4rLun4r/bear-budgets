import CurrencyInput from "@/components/itemInputs/CurrencyInput";
import { useState } from "react";

const CreateBudget = () => {
  const [value, setValue] = useState<number | undefined>(1);

  return (
    <>
      <CurrencyInput
        value={value}
        onValueChange={setValue}
        label="Valor unitário"
      />
    </>
  )
}

export default CreateBudget;