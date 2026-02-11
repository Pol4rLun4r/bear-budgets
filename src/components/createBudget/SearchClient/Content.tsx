// styles
import classes from './SearchClient.module.css';

// mantine
import { Text, Button, Stack, Box, Alert } from '@mantine/core';

// types
import type { ClientType } from './SearchClient';

// icons
import { IconSearch } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';

// components
import Loading from './Loading';
import Rows from './Rows';

const NoSearch = () => {
    return (
        <>
            <Text style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', gap: 5 }}>
                Faça uma busca <IconSearch size={18} />
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
            <div className={classes.containerLoading}>
                {/* <Loading /> */}
                {/* Sem resultados */}
                {clients.length === 0 && form.values.query.trim().length > 0 && !error && (
                    <Stack className={classes.messages}>
                        <Alert title="Sem resultados" mt="md" variant='transparent'>
                            Nenhum cliente encontrado
                        </Alert>
                    </Stack>
                )}

                {/* Estado de erro */}
                {error && (
                    <Stack className={classes.messages}>
                        <Alert title="Erro" color="red" mt="md" variant="transparent">
                            {error}
                        </Alert>
                    </Stack>
                )}

                {/* Sem busca ainda */}
                {clients.length === 0 && form.values.query.trim().length === 0 && (
                    <Stack className={classes.messages}>
                        <NoSearch />
                    </Stack>
                )}
            </div>
            {/* Com resultados */}
            {clients.length > 0 && (
                <Rows clients={clients} />
            )}
        </Box >
    )
}

export default Content;

