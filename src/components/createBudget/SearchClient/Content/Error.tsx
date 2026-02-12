// mantine
import { Stack, Alert } from "@mantine/core"

// styles
import classes from '../SearchClient.module.css'

const Error = ({ error }: { error: string | null }) => {
    return (
        <>
            {error && (
                <Stack className={classes.messages}>
                    <Alert title="Erro" color="red" mt="md" variant="transparent">
                        {error}
                    </Alert>
                </Stack>
            )}
        </>
    )
}

export default Error