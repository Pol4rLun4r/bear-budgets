import { useEffect, useState } from 'react';
import {
    ActionIcon,
    Alert,
    Button,
    Group,
    Loader,
    NumberInput,
    Paper,
    Stack,
    Tabs,
    Text,
    TextInput,
    Title,
    Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import classes from '../Settings.module.css';

const errorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Tente novamente.';

const SettingsMarginsPanel = () => {
    const [margins, setMargins] = useState<CustomMargin[]>([]);
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState<number | string>(40);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        let isMounted = true;
        window.api.margins.get().then((savedMargins) => {
            if (isMounted) setMargins(savedMargins);
        }).catch((error: unknown) => {
            if (isMounted) setLoadError(errorMessage(error));
        }).finally(() => {
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [reloadCount]);

    const addMargin = async () => {
        if (saving || typeof percentage !== 'number') return;

        setSaving(true);
        try {
            const savedMargins = await window.api.margins.add({ name, percentage });
            setMargins(savedMargins);
            setName('');
            notifications.show({
                color: 'green',
                title: 'Margem adicionada',
                message: `${percentage}% ${name.trim()} já pode ser usada no campo de markup.`,
            });
        } catch (error) {
            notifications.show({
                color: 'red',
                title: 'Não foi possível adicionar a margem',
                message: errorMessage(error),
            });
        } finally {
            setSaving(false);
        }
    };

    const removeMargin = async (margin: CustomMargin) => {
        if (saving) return;

        setSaving(true);
        try {
            setMargins(await window.api.margins.remove(margin.id));
            notifications.show({
                color: 'green',
                title: 'Margem removida',
                message: `${margin.percentage}% ${margin.name} não aparecerá mais como atalho.`,
            });
        } catch (error) {
            notifications.show({
                color: 'red',
                title: 'Não foi possível remover a margem',
                message: errorMessage(error),
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Tabs.Panel value="margins" className={classes.panel}>
            <Stack gap="lg">
                <Stack gap={4}>
                    <Title order={3}>Margens personalizadas</Title>
                    <Text size="sm" c="dimmed">
                        Crie nomes fáceis de reconhecer para percentuais usados com frequência.
                        Elas são salvas em um arquivo separado das configurações e do banco de dados.
                    </Text>
                </Stack>

                <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
                    <Stack gap="sm">
                        <Stack gap={4}>
                            <Title order={5}>Adicionar margem</Title>
                            <Text size="sm" c="dimmed">
                                No campo Markup, o atalho aparece com o percentual antes do nome,
                                por exemplo: 40% Revenda.
                            </Text>
                        </Stack>
                        <Group align="flex-end" wrap="wrap">
                            <TextInput
                                label="Nome"
                                placeholder="Ex.: Revenda"
                                value={name}
                                maxLength={80}
                                disabled={saving}
                                style={{ flex: '1 1 14rem' }}
                                onChange={(event) => setName(event.currentTarget.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') void addMargin();
                                }}
                            />
                            <NumberInput
                                label="Markup (%)"
                                min={0}
                                max={1000}
                                step={1}
                                allowDecimal={false}
                                value={percentage}
                                disabled={saving || loading || loadError !== null}
                                w={150}
                                onChange={setPercentage}
                            />
                            <Button
                                onClick={() => void addMargin()}
                                loading={saving}
                                disabled={
                                    !name.trim() ||
                                    typeof percentage !== 'number' ||
                                    loading ||
                                    loadError !== null
                                }
                            >
                                Adicionar margem
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Title order={5}>Atalhos salvos</Title>
                            <Text size="sm" c="dimmed">{margins.length}</Text>
                        </Group>
                        {loading ? (
                            <Group gap="xs">
                                <Loader size="sm" />
                                <Text size="sm" c="dimmed">Carregando margens…</Text>
                            </Group>
                        ) : loadError ? (
                            <Alert color="red" icon={<IconAlertCircle size={16} />}>
                                <Stack gap="xs">
                                    <Text size="sm">{loadError}</Text>
                                    <Button
                                        size="xs"
                                        variant="light"
                                        w="fit-content"
                                        onClick={() => {
                                            setLoading(true);
                                            setLoadError(null);
                                            setReloadCount((count) => count + 1);
                                        }}
                                    >
                                        Tentar novamente
                                    </Button>
                                </Stack>
                            </Alert>
                        ) : margins.length === 0 ? (
                            <Text size="sm" c="dimmed">
                                Nenhum atalho criado. Adicione uma margem acima para começar.
                            </Text>
                        ) : (
                            <Stack gap="xs">
                                {margins.map((margin) => (
                                    <Group
                                        key={margin.id}
                                        justify="space-between"
                                        wrap="nowrap"
                                        gap="sm"
                                    >
                                        <Tooltip
                                            label={`${margin.percentage}% ${margin.name}`}
                                            withArrow
                                            multiline
                                            maw={360}
                                        >
                                            <Text size="sm" truncate style={{ minWidth: 0 }}>
                                                <strong>{margin.percentage}%</strong> {margin.name}
                                            </Text>
                                        </Tooltip>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            aria-label={`Remover ${margin.name}`}
                                            disabled={saving}
                                            onClick={() => void removeMargin(margin)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Tabs.Panel>
    );
};

export default SettingsMarginsPanel;
