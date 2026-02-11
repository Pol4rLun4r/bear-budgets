// styles
import classes from './SearchClient.module.css';

// mantine
import { Text, Button, Stack, Box, Alert } from '@mantine/core';

// types
import type { ClientType } from './SearchClient';

// icons
import { IconSearch } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';
import Rows from './Rows';

const NoSearch = () => {
    return (
        <>
            <Text style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', gap: 5 }}>
                Sem um cliente no momento, faça uma busca <IconSearch size={18} />
            </Text>
            <Text>OU</Text>
            <Button variant="gradient" radius='lg'>Criar novo cliente</Button>
        </>
    )
}

interface ContenteType {
    loading: boolean;
    clients: ClientType[];
    error: string | null;
    form: UseFormReturnType<{
        query: string;
        typeQuery: string;
    }, (values: {
        query: string;
        typeQuery: string;
    }) => {
        query: string;
        typeQuery: string;
    }>
}

const Content = ({ clients, error, form }: ContenteType) => {
    return (
        <Box className={classes.box}>
            <Stack className={classes.nothing}>
                {/* Estado de erro */}
                {error && (
                    <Alert title="Erro" color="red" mt="md" variant="transparent">
                        {error}
                    </Alert>
                )}

                {/* Sem busca ainda */}
                {clients.length === 0 && form.values.query.trim().length === 0 && (
                    <NoSearch />
                )}

                {/* Sem resultados */}
                {clients.length === 0 && form.values.query.trim().length > 0 && !error && (
                    <div>
                        <Alert title="Sem resultados" mt="md" variant='transparent'>
                            Nenhum cliente encontrado
                        </Alert>
                    </div>
                )}

                {/* Com resultados */}
                {clients.length > 0 && (
                    <Rows clients={clients} />
                )}
            </Stack>
        </Box>
    )
}

export default Content;

