import { useEffect } from 'react';

// global style
import './global.css'

// mantine
import { Button, Center, Loader, Stack, Text } from '@mantine/core';

// components
import MantineProvider from './MantineProvider'
import AppLayout from './layout/@AppLayout';

// redux
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { loadSettings } from '@/features/settings/store/settings.slice';

const App = () => {
    const dispatch = useAppDispatch();
    const loadStatus = useAppSelector((state) => state.settings.loadStatus);
    const loadError = useAppSelector((state) => state.settings.loadError);

    useEffect(() => {
        if (loadStatus === 'idle') {
            void dispatch(loadSettings());
        }
    }, [dispatch, loadStatus]);

    return (
        <MantineProvider>
            {loadStatus === 'loaded' ? (
                <AppLayout />
            ) : loadStatus === 'error' ? (
                <Center h="100vh">
                    <Stack align="center" gap="sm">
                        <Text c="red" role="alert">
                            Não foi possível carregar as configurações: {loadError}
                        </Text>
                        <Button onClick={() => void dispatch(loadSettings())}>
                            Tentar novamente
                        </Button>
                    </Stack>
                </Center>
            ) : (
                <Center h="100vh">
                    <Loader aria-label="Carregando configurações" />
                </Center>
            )}
        </MantineProvider>
    )
}

export default App;