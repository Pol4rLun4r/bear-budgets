import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Radio,
    Stack,
    Tabs,
    Text,
    Title,
} from '@mantine/core';
import { IconDeviceFloppy, IconMoon, IconSun, IconTrash, IconX } from '@tabler/icons-react';
import SettingsSaveStatus from './SettingsSaveStatus';
import classes from '../Settings.module.css';

interface SettingsAppearancePanelProps {
    settings?: AppSettings['appearance'];
    dirty: boolean;
    saving: boolean;
    onChange: (update: SettingsUpdate) => void;
    onSave: () => void;
    onRequestClose: () => void;
}

const SettingsAppearancePanel = ({
    settings,
    dirty,
    saving,
    onChange,
    onSave,
    onRequestClose,
}: SettingsAppearancePanelProps) => {
    const restoreDefaults = () => onChange({
        appearance: { colorScheme: 'auto' },
    });

    return (
        <Tabs.Panel value="appearance" className={classes.interfacePanel}>
            <div className={classes.panelHeader}>
                <Title order={3}>Aparência</Title>
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
                        Salvar alterações de aparência
                    </Button>
                    <Button
                        size="xs"
                        color="red"
                        variant="light"
                        leftSection={<IconTrash size={16} />}
                        disabled={saving || settings?.colorScheme === 'auto'}
                        onClick={restoreDefaults}
                    >
                        Restaurar padrão
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
                                <Title order={5}>Tema</Title>
                                <Text size="sm" c="dimmed">
                                    Escolha como o Bear Budgets deve aparecer. A opção do sistema acompanha
                                    automaticamente a preferência do seu dispositivo.
                                </Text>
                            </Stack>
                            <Radio.Group
                                label="Aparência do aplicativo"
                                value={settings?.colorScheme ?? 'auto'}
                                onChange={(value) => {
                                    if (value === 'auto' || value === 'light' || value === 'dark') {
                                        onChange({ appearance: { colorScheme: value } });
                                    }
                                }}
                            >
                                <Stack gap="xs" mt="xs">
                                    <Radio
                                        value="auto"
                                        label="Seguir o sistema"
                                        description="Usa o modo claro ou escuro definido no dispositivo."
                                    />
                                    <Radio
                                        value="light"
                                        label="Modo claro"
                                        description="Mantém a interface clara."
                                        icon={IconSun}
                                    />
                                    <Radio
                                        value="dark"
                                        label="Modo escuro"
                                        description="Mantém a interface escura."
                                        icon={IconMoon}
                                    />
                                </Stack>
                            </Radio.Group>
                        </Stack>
                    </Paper>
                </Stack>
            </div>
        </Tabs.Panel>
    );
};

export default SettingsAppearancePanel;
