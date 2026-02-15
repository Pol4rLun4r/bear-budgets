// mantine
import { Text, Button, Stack } from "@mantine/core"

// icon
import { IconSearch } from "@tabler/icons-react"

// style
import classes from '../SearchClient.module.css'

interface NoSearchProps {
    hasQuery: number;
    onCreateNewClient?: () => void; 
}

const NoSearch = ({ hasQuery, onCreateNewClient }: NoSearchProps) => {
    return (
        <>
            {hasQuery === 0 &&
                <Stack className={classes.messages}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', gap: 5 }}>
                        Faça uma busca <IconSearch size={18} />
                    </Text>
                    <Text>OU</Text>
                    <Button variant="gradient" radius='lg' onClick={onCreateNewClient}>Criar novo cliente</Button>
                </Stack>
            }
        </>
    )
}

export default NoSearch;