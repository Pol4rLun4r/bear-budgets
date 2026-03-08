// mantine
import { TextInput } from "@mantine/core"

// config
import { configInputs } from "./config";

const DocumentInput = () => {
  return (
    <TextInput
      // {...form.getInputProps('document')}
      {...configInputs}
      label="CNPJ ou CPF"
      description="Informe o documento com ou sem pontuação"
      placeholder="00.000.000/0000-00"
    />
  )
}

export default DocumentInput;