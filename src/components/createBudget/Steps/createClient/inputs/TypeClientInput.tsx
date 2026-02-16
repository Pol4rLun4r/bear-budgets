// types
import type { FormDataType } from "./type"

// mantine
import { Text, SegmentedControl } from "@mantine/core"

const TypeClientInput = ({ form }: FormDataType) => {
    return (
        <>
            <Text mt='md' c='dimmed' size="sm">Por padrão o cliente é nacional</Text>
            <SegmentedControl
                {...form.getInputProps('type_client')}
                fullWidth
                radius='lg'
                size="md"
                data={[
                    { label: 'Nacional', value: 'nacional' },
                    { label: 'Internacional', value: 'internacional' }
                ]}
            />
        </>
    )
}

export default TypeClientInput;