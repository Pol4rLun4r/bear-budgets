// types
import type { FormDataType } from "./type"

// mantine
import { TextInput } from "@mantine/core"

const NameInput = ({ form }: FormDataType) => {
    return (
        <TextInput
            {...form.getInputProps('name')}
            mt='md'
            radius='lg'
            size="md"
            label="Nome do cliente"
            description="Informar o nome do cliente ou um apelido"
            placeholder="Polaroid da silva"
        />
    )
}

export default NameInput;