// types
import type { FormDataType } from "./type"

// mantine
import { Textarea } from "@mantine/core"

const NotesInput = ({ form }: FormDataType) => {
    return (
        <Textarea
          {...form.getInputProps('notes')}
          radius='lg'
          mt="md"
          size="md"
          label="Notas"
          description="Qualquer informação que possa ser necessária"
          placeholder="Exemplo: Itens de alto valor"
          autosize
          minRows={3}
        />
    )
}

export default NotesInput;