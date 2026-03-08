// mantine
import { TextInput } from "@mantine/core"

// config
import { configInputs } from "./config";

const NameInput = () => {
  return (
    <TextInput
      // {...form.getInputProps('name')}
      {...configInputs}
      label="Nome do cliente"
      description="Informar o nome do cliente ou um apelido"
      placeholder="Polaroid da silva"
    />
  )
}

export default NameInput;