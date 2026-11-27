import { useEffect, useState } from 'react';

// global style
import './global.css'

// mantine
import { Button, Center, Loader, Stack, Text, useMantineColorScheme } from '@mantine/core';

// components
import MantineProvider from './MantineProvider'
import AppLayout from './layout/@AppLayout';
import AutomaticUpdateOverlay from '@/features/update/AutomaticUpdateOverlay';
import AutomaticUpdatePreview from '@/features/update/AutomaticUpdatePreview';
import { useAppUpdate } from '@/hooks/useAppUpdate';

// redux
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { loadSettings } from '@/features/settings/store/settings.slice';

const App = () => {
    const previewUpdate = import.meta.env.DEV &&
        new URLSearchParams(window.location.search).has('preview-update');

    if (previewUpdate) return <AutomaticUpdatePreview />;

    return <Application />;
};

const Application = () => {
    const dispatch = useAppDispatch();
    const loadStatus = useAppSelector((state) => state.settings.loadStatus);
    const loadError = useAppSelector((state) => state.settings.loadError);
    const update = useAppUpdate();
    const [dismissedUpdateError, setDismissedUpdateError] = useState<AppUpdateState | null>(null);

    const blockingUpdate = update.automatic === true &&
        ['checking', 'downloading', 'downloaded', 'preparing', 'installing', 'finalizing']
            .includes(update.status);
    const showingUpdateError = update.automatic === true &&
        update.status === 'error' &&
        dismissedUpdateError !== update;

    useEffect(() => {
        if (loadStatus === 'idle') {
            void dispatch(loadSettings());
        }
    }, [dispatch, loadStatus]);

    return (
        <MantineProvider>
            <SettingsColorScheme />
            <div inert={blockingUpdate || showingUpdateError} aria-hidden={blockingUpdate || showingUpdateError}>
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
            </div>
            {(blockingUpdate || showingUpdateError) && (
                <AutomaticUpdateOverlay
                    update={update}
                    onContinue={() => setDismissedUpdateError(update)}
                />
            )}
        </MantineProvider>
    )
}

const SettingsColorScheme = () => {
    const colorScheme = useAppSelector(
        (state) => state.settings.value?.appearance.colorScheme ?? 'auto',
    );
    const { setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        setColorScheme(colorScheme);
    }, [colorScheme, setColorScheme]);

    return null;
};

export default App;