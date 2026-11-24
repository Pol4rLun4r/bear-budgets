import {
    Badge,
    Button,
    Group,
    ActionIcon,
    Paper,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import {
    IconAdjustments,
    IconDeviceFloppy,
    IconFileInvoice,
    IconLock,
    IconReceipt,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import {
    budgetTableColumns,
    defaultSimpleModeVisibleColumns,
} from '@/features/budget/budgetForm/components/itemTable/budgetTableColumns';
import {
    defaultItemReferenceSimpleFields,
    defaultItemValuesSimpleFields,
    itemReferenceSimpleFields,
    itemReferenceRequiredFields,
    itemValuesSimpleFields,
    itemValuesRequiredFields,
} from '../itemFormSettings.data';
import SettingsOption from './SettingsOption';
import SettingsSaveStatus from './SettingsSaveStatus';
import ItemFormSettingsCard from './ItemFormSettingsCard';
import classes from '../Settings.module.css';

interface SettingsInterfacePanelProps {
    settings?: AppSettings['interface'];
    dirty: boolean;
    saving: boolean;
    onChange: (update: SettingsUpdate) => void;
    onSave: () => void;
    onRequestClose: () => void;
}

const SettingsInterfacePanel = ({
    settings,
    dirty,
    saving,
    onChange,
    onSave,
    onRequestClose,
}: SettingsInterfacePanelProps) => {
    const categorySettings = settings?.budgetTable;
    const itemFormSettings = settings?.itemForm;

    if (!categorySettings || !itemFormSettings) return null;

    const visibleColumns = new Set(categorySettings.simpleModeVisibleColumns);
    const hasDefaultFields = <T extends string,>(fields: T[], defaults: T[]) =>
        fields.length === defaults.length && defaults.every((field) => fields.includes(field));
    const hasDefaultColumns =
        categorySettings.simpleModeVisibleColumns.length === defaultSimpleModeVisibleColumns.length &&
        defaultSimpleModeVisibleColumns.every((column) => visibleColumns.has(column));
    const referenceSettings = itemFormSettings.itemReference;
    const valuesSettings = itemFormSettings.itemValues;
    const isDefault =
        categorySettings.defaultSimpleMode &&
        !categorySettings.defaultTagEditingEnabled &&
        hasDefaultColumns &&
        !referenceSettings.defaultSimpleMode &&
        hasDefaultFields(referenceSettings.simpleModeVisibleFields, defaultItemReferenceSimpleFields) &&
        !valuesSettings.defaultSimpleMode &&
        hasDefaultFields(valuesSettings.simpleModeVisibleFields, defaultItemValuesSimpleFields) &&
        valuesSettings.defaultMarkup === 40 &&
        valuesSettings.defaultBoarding === 0 &&
        valuesSettings.defaultDelivery === 3;

    const restoreDefaults = () => onChange({
        interface: {
            budgetTable: {
                defaultSimpleMode: true,
                defaultTagEditingEnabled: false,
                simpleModeVisibleColumns: defaultSimpleModeVisibleColumns,
            },
            itemForm: {
                itemReference: {
                    defaultSimpleMode: false,
                    simpleModeVisibleFields: defaultItemReferenceSimpleFields,
                },
                itemValues: {
                    defaultSimpleMode: false,
                    simpleModeVisibleFields: defaultItemValuesSimpleFields,
                    defaultMarkup: 40,
                    defaultBoarding: 0,
                    defaultDelivery: 3,
                },
            },
        },
    });

    return (
        <Tabs.Panel value="interface" className={classes.interfacePanel}>
            <GroupHeader
                dirty={dirty}
                saving={saving}
                isDefault={isDefault}
                onSave={onSave}
                onRestoreDefaults={restoreDefaults}
                onRequestClose={onRequestClose}
            />
            <div className={classes.interfaceScrollArea}>
                <Stack gap="lg">
                <Tabs
                    defaultValue="budgets"
                    variant="outline"
                    radius="md"
                    keepMounted={false}
                >
                    <Tabs.List className={classes.subcategoryNavigation}>
                        <Tabs.Tab
                            value="budgets"
                            leftSection={<IconReceipt size={18} stroke={1.7} />}
                            fw={600}
                            fz="md"
                        >
                            Orçamentos
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="item-form"
                            leftSection={<IconFileInvoice size={18} stroke={1.7} />}
                            fw={600}
                            fz="md"
                        >
                            Formulário do item
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="budgets" pt="md">
                        <Stack gap="md">
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">
                                    Preferências da tabela e das colunas dos itens do orçamento.
                                </Text>
                            </Stack>
                                <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
                                    <Stack gap="sm">
                                        <Stack gap={4}>
                                            <Title order={5}>Interface do orçamento</Title>
                                            <Text size="sm" c="dimmed">
                                                Defina como a tabela de itens será aberta por padrão.
                                            </Text>
                                        </Stack>
                                        <SettingsOption
                                            label="Iniciar no modo simples"
                                            description="Novas tabelas de orçamento começam no modo simples."
                                            checked={categorySettings.defaultSimpleMode}
                                            onChange={(checked) => onChange({
                                                interface: { budgetTable: { defaultSimpleMode: checked } },
                                            })}
                                        />
                                        <SettingsOption
                                            label="Iniciar com caixas de seleção habilitadas"
                                            description="Novos orçamentos e orçamentos abertos começam exibindo a coluna de caixas de seleção."
                                            checked={categorySettings.defaultTagEditingEnabled}
                                            onChange={(checked) => onChange({
                                                interface: { budgetTable: { defaultTagEditingEnabled: checked } },
                                            })}
                                        />
                                    </Stack>
                                </Paper>

                                <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
                                    <Stack gap="sm">
                                        <Stack gap={4}>
                                            <Title order={5}>Colunas dos itens do orçamento</Title>
                                            <Text size="sm" c="dimmed">
                                                Escolha quais colunas aparecem no modo simples. A coluna Item é obrigatória.
                                            </Text>
                                        </Stack>
                                        <Paper className={classes.fieldGroup} radius="md" p="sm" withBorder>
                                            <Stack gap="xs">
                                                <Group justify="space-between" align="center">
                                                    <Title order={5}>Sempre visível no modo simples</Title>
                                                    <Badge
                                                        color="gray"
                                                        variant="light"
                                                        leftSection={<IconLock size={12} />}
                                                    >
                                                        Fixo
                                                    </Badge>
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    Esta coluna identifica cada item e não pode ser ocultada.
                                                </Text>
                                                <Group gap="xs" wrap="nowrap">
                                                    <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                                                        <IconLock size={12} />
                                                    </ThemeIcon>
                                                    <Stack gap={0}>
                                                        <Text size="sm" fw={600}>Item</Text>
                                                        <Text size="xs" c="dimmed">
                                                            Identifica a posição do item na tabela.
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Stack>
                                        </Paper>

                                        <Paper className={classes.fieldGroup} radius="md" p="sm" withBorder>
                                            <Stack gap="xs">
                                                <Group justify="space-between" align="center">
                                                    <Group gap="xs">
                                                        <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                                                            <IconAdjustments size={14} />
                                                        </ThemeIcon>
                                                        <Title order={5}>Colunas que você pode escolher</Title>
                                                    </Group>
                                                    <Badge color="gray" variant="light">
                                                        Personalizáveis
                                                    </Badge>
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    Ative para mostrar a coluna no modo simples. Desative para deixá-la disponível apenas no modo completo.
                                                </Text>
                                                <Stack gap={0}>
                                                    {budgetTableColumns.map(({ id, label, description }, index) => (
                                                        <div
                                                            key={id}
                                                            className={index === 0 ? undefined : classes.optionDivider}
                                                        >
                                                            <SettingsOption
                                                                label={label}
                                                                description={description}
                                                                checked={visibleColumns.has(id)}
                                                                onChange={(checked) => {
                                                                    const nextColumns = checked
                                                                        ? [...categorySettings.simpleModeVisibleColumns, id]
                                                                        : categorySettings.simpleModeVisibleColumns.filter(
                                                                            (column) => column !== id,
                                                                        );

                                                                    onChange({
                                                                        interface: {
                                                                            budgetTable: {
                                                                                simpleModeVisibleColumns: nextColumns,
                                                                            },
                                                                        },
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                </Paper>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="item-form" pt="md">
                            <Stack gap="md">
                                <Stack gap={4}>
                                    <Text size="sm" c="dimmed">
                                        Preferências dos dados de referência e dos valores do item.
                                    </Text>
                                </Stack>
                                <ItemFormSettingsCard
                                    title="Dados de referência"
                                    description="Preferências para descrição, códigos e informações relacionadas ao item."
                                    requiredFields={itemReferenceRequiredFields}
                                    defaultSimpleMode={referenceSettings.defaultSimpleMode}
                                    visibleFields={referenceSettings.simpleModeVisibleFields}
                                    fields={itemReferenceSimpleFields}
                                    onDefaultSimpleModeChange={(enabled) => onChange({
                                        interface: {
                                            itemForm: {
                                                itemReference: { defaultSimpleMode: enabled },
                                            },
                                        },
                                    })}
                                    onVisibleFieldsChange={(field, enabled) => {
                                        const nextFields = enabled
                                            ? [...referenceSettings.simpleModeVisibleFields, field]
                                            : referenceSettings.simpleModeVisibleFields.filter(
                                                (currentField) => currentField !== field,
                                            );

                                        onChange({
                                            interface: {
                                                itemForm: {
                                                    itemReference: { simpleModeVisibleFields: nextFields },
                                                },
                                            },
                                        });
                                    }}
                                />
                                <ItemFormSettingsCard
                                    title="Valores do item"
                                    description="Preferências para preços, quantidades, impostos e custos adicionais."
                                    requiredFields={itemValuesRequiredFields}
                                    defaultSimpleMode={valuesSettings.defaultSimpleMode}
                                    visibleFields={valuesSettings.simpleModeVisibleFields}
                                    fields={itemValuesSimpleFields}
                                    defaultValues={{
                                        markup: valuesSettings.defaultMarkup,
                                        boarding: valuesSettings.defaultBoarding,
                                        delivery: valuesSettings.defaultDelivery,
                                    }}
                                    onDefaultSimpleModeChange={(enabled) => onChange({
                                        interface: {
                                            itemForm: {
                                                itemValues: { defaultSimpleMode: enabled },
                                            },
                                        },
                                    })}
                                    onVisibleFieldsChange={(field, enabled) => {
                                        const nextFields = enabled
                                            ? [...valuesSettings.simpleModeVisibleFields, field]
                                            : valuesSettings.simpleModeVisibleFields.filter(
                                                (currentField) => currentField !== field,
                                            );

                                        onChange({
                                            interface: {
                                                itemForm: {
                                                    itemValues: { simpleModeVisibleFields: nextFields },
                                                },
                                            },
                                        });
                                    }}
                                    onDefaultValuesChange={(itemValuesUpdate) => {
                                        onChange({
                                            interface: {
                                                itemForm: { itemValues: itemValuesUpdate },
                                            },
                                        });
                                    }}
                                />
                            </Stack>
                    </Tabs.Panel>
                </Tabs>
                </Stack>
            </div>
        </Tabs.Panel>
    );
};

const GroupHeader = ({
    dirty,
    saving,
    isDefault,
    onSave,
    onRestoreDefaults,
    onRequestClose,
}: {
    dirty: boolean;
    saving: boolean;
    isDefault: boolean;
    onSave: () => void;
    onRestoreDefaults: () => void;
    onRequestClose: () => void;
}) => (
    <div className={classes.panelHeader}>
        <Title order={3}>Interface</Title>
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
                Salvar alterações da interface
            </Button>
            <Button
                size="xs"
                color="red"
                variant="light"
                leftSection={<IconTrash size={16} />}
                disabled={saving || isDefault}
                onClick={onRestoreDefaults}
            >
                Restaurar padrões da interface
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
);

export default SettingsInterfacePanel;
