// types
import type { FormDataType } from "./type"

// mantine
import { TextInput } from "@mantine/core"

const DocumentInput = ({ form }: FormDataType) => {
    return (
        <TextInput
            {...form.getInputProps('document')}
            radius='lg'
            mt='xl'
            size="md"
            label="CNPJ ou CPF"
            description="Informe o documento com ou sem pontuação"
            placeholder="00.000.000/0000-00"
        />
    )
}

export default DocumentInput;