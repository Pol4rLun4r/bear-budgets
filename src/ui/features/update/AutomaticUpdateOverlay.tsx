import {
    Button,
    Center,
    FocusTrap,
    Overlay,
    Paper,
    Progress,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconSnowflake } from '@tabler/icons-react';
import classes from './AutomaticUpdateOverlay.module.css';

interface AutomaticUpdateOverlayProps {
    update: AppUpdateState;
    onContinue: () => void;
}

type AutomaticUpdateStatus =
    | 'checking'
    | 'downloading'
    | 'downloaded'
    | 'preparing'
    | 'installing'
    | 'finalizing'
    | 'error';

const isAutomaticUpdateStatus = (
    status: AppUpdateStatus,
): status is AutomaticUpdateStatus => (
    status === 'checking' ||
    status === 'downloading' ||
    status === 'downloaded' ||
    status === 'preparing' ||
    status === 'installing' ||
    status === 'finalizing' ||
    status === 'error'
);

const messages: Record<
    AutomaticUpdateStatus,
    { title: string; description: (update: AppUpdateState) => string }
> = {
    checking: {
        title: 'Verificando atualizações',
        description: () => 'Estamos verificando se existe uma nova versão do Bear Budgets.',
    },
    downloading: {
        title: 'Baixando atualização',
        description: (update) => `Baixando a versão ${update.version ?? 'mais recente'}...`,
    },
    downloaded: {
        title: 'Download concluído',
        description: () => 'A atualização foi baixada. A instalação começará automaticamente em instantes.',
    },
    preparing: {
        title: 'Preparando instalação',
        description: () => 'O download foi concluído. Estamos preparando a instalação.',
    },
    installing: {
        title: 'Instalando atualização',
        description: () => 'A instalação da atualização será iniciada automaticamente.',
    },
    finalizing: {
        title: 'Finalizando',
        description: () => 'O Bear Budgets será reaberto quando a atualização terminar.',
    },
    error: {
        title: 'Não foi possível atualizar',
        description: (update) => update.error ?? 'Ocorreu um erro durante a atualização automática.',
    },
};

const AutomaticUpdateOverlay = ({
    update,
    onContinue,
}: AutomaticUpdateOverlayProps) => {
    const downloading = update.status === 'downloading';
    const failed = update.status === 'error';
    const progress = Math.min(100, Math.max(0, Math.round(update.percent ?? 0)));

    if (!update.automatic || !isAutomaticUpdateStatus(update.status)) return null;

    const message = messages[update.status];

    return (
        <>
            <Overlay
                fixed
                zIndex={2000}
                color="var(--mantine-color-body)"
                backgroundOpacity={0.96}
                blur={8}
            />
            <FocusTrap active>
                <div
                    className={classes.root}
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="automatic-update-title"
                    aria-describedby="automatic-update-description"
                    tabIndex={-1}
                    data-autofocus
                >
                    <Center w="100%">
                        <Paper className={classes.card} radius="xl" p="xl" withBorder>
                            <Stack align="center" gap="lg">
                                <IconSnowflake
                                    size={88}
                                    stroke={1.5}
                                    className={classes.icon}
                                    aria-hidden="true"
                                />
                                <Stack align="center" gap="xs">
                                    <Title id="automatic-update-title" order={2} ta="center" aria-live="polite">
                                        {message.title}
                                    </Title>
                                    <Text
                                        id="automatic-update-description"
                                        c="dimmed"
                                        ta="center"
                                        maw={420}
                                        aria-live="polite"
                                    >
                                        {message.description(update)}
                                    </Text>
                                </Stack>
                                {!failed && update.status !== 'checking' && (
                                    <Stack w="100%" gap="xs">
                                        <Progress
                                            value={downloading ? progress : 100}
                                            striped={downloading}
                                            animated={downloading}
                                            radius="xl"
                                            size="lg"
                                            aria-label="Progresso do download da atualização"
                                        />
                                        {downloading && (
                                            <Text size="sm" c="dimmed" ta="right">
                                                {progress}%
                                            </Text>
                                        )}
                                    </Stack>
                                )}
                                {failed && (
                                    <Button variant="light" onClick={onContinue}>
                                        Continuar sem atualizar
                                    </Button>
                                )}
                            </Stack>
                        </Paper>
                    </Center>
                </div>
            </FocusTrap>
        </>
    );
};

export default AutomaticUpdateOverlay;
