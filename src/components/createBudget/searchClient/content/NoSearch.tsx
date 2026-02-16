// mantine
import { Text, Stack } from "@mantine/core"

// icon
import { IconSearch } from "@tabler/icons-react"

// style
import classes from '../SearchClient.module.css'

interface NoSearchProps {
    hasQuery: number;
}

const NoSearch = ({ hasQuery }: NoSearchProps) => {
    return (
        <>
            {hasQuery === 0 &&
                <Stack className={classes.messages}>
                    <Stack justify="center" align="center">
                        <Text
                            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                        >
                            Faça uma busca para encontrar um cliente <IconSearch size={18} /></Text>
                        <Text>OU</Text>
                        <Text>Adicionar um novo caso não encontre!</Text>
                    </Stack>
                </Stack>
            }
        </>
    )
}

export default NoSearch;