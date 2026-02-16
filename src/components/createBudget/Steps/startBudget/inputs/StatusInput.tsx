// type
import type { FormDataType } from "./type"

// mantine
import { Text, SegmentedControl } from "@mantine/core"

const StatusInput = ({form}: FormDataType) => {
    return (
        <>
            <Text c='dimmed' size="sm">Por padrão o orçamento é um Rascunho</Text>
            <SegmentedControl
                {...form.getInputProps('type_client')}
                fullWidth
                radius='lg'
                size="md"
                data={[
                    { label: 'Rascunho', value: '0' },
                    { label: 'Aprovado', value: '1' },
                ]}
            />
        </>
    )
}

export default StatusInput