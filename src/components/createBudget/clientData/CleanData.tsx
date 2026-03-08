// mantine
import { ActionIcon, Tooltip } from "@mantine/core"

// icon
import { IconEraser } from "@tabler/icons-react"

const CleanData = () => {
    return (
        <Tooltip label='Limpar dados do cliente'>
            <ActionIcon size="xl" radius="lg" variant="light">
                <IconEraser />
            </ActionIcon>
        </Tooltip>
    )
}

export default CleanData