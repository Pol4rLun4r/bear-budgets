import { ActionIcon, Button, Group, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import { IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react';
import SettingsOption from './SettingsOption';
import SettingsSaveStatus from './SettingsSaveStatus';
import classes from '../Settings.module.css';

interface SettingsGeneralPanelProps {
    settings?: AppSettings['general'];
    dirty: boolean;
    saving: boolean;
    onChange: (update: SettingsUpdate) => void;
    onSave: () => void;
    onRequestClose: () => void;
}

const SettingsGeneralPanel = ({
    settings,
    dirty,
    saving,
    onChange,
    onSave,
    onRequestClose,
}: SettingsGeneralPanelProps) => (
    <Tabs.Panel value="general" className={classes.interfacePanel}>
        <div className={classes.panelHeader}>
            <Title order={3}>Geral</Title>
            <Group gap="sm">
                <SettingsSaveStatus pendingWrites={saving ? 1 : 0} />
                <Button
                    size="xs"
                    color="green"
                    variant="light"
                    leftSection={<IconDeviceFloppy size={16} />}
                    disabled={!dirty || saving}
                    onClick={onSave}
                >
                    Salvar alterações gerais
                </Button>
                <Button
                    size="xs"
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={16} />}
                    disabled={saving || settings?.automaticUpdates === true}
                    onClick={() => onChange({ general: { automaticUpdates: true } })}
                >
                    Restaurar padrões gerais
                </Button>
                <ActionIcon
                    variant="light"
                    color="gray"
                    aria-label="Fechar configurações"
                    disabled={saving}
                    onClick={onRequestClose}
                >
                    <IconX size={16} />
                </ActionIcon>
            </Group>
        </div>
        <div className={classes.interfaceScrollArea}>
            <Stack gap="lg">
                <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
                    <Stack gap="sm">
                        <Stack gap={4}>
                            <Title order={5}>Atualizações do aplicativo</Title>
                            <Text size="sm" c="dimmed">
                                Escolha como o Bear Budgets deve instalar novas versões.
                            </Text>
                        </Stack>
                        <SettingsOption
                            label="Atualizar o aplicativo automaticamente"
                            description="Verifica, baixa e instala novas versões ao iniciar o aplicativo."
                            checked={settings?.automaticUpdates ?? true}
                            disabled={!settings}
                            onChange={(automaticUpdates) => onChange({
                                general: { automaticUpdates },
                            })}
                        />
                    </Stack>
                </Paper>
            </Stack>
        </div>
    </Tabs.Panel>
);

export default SettingsGeneralPanel;
