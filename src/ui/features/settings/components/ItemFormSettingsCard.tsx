import { Badge, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAdjustments, IconLock } from '@tabler/icons-react';
import SettingsOption from './SettingsOption';
import ItemFormDefaultValues from './ItemFormDefaultValues';
import classes from '../Settings.module.css';

type SimpleFormField = ItemReferenceSimpleField | ItemValuesSimpleField;

interface ItemFormSettingsCardProps<T extends SimpleFormField> {
    title: string;
    description: string;
    requiredFields: {
        label: string;
        description: string;
    }[];
    defaultSimpleMode: boolean;
    visibleFields: T[];
    fields: {
        id: T;
        label: string;
        description: string;
    }[];
    onDefaultSimpleModeChange: (enabled: boolean) => void;
    onVisibleFieldsChange: (
        field: T,
        enabled: boolean,
    ) => void;
    defaultValues?: {
        markup: number;
        boarding: number;
        delivery: number;
    };
    onDefaultValuesChange?: (values: {
        defaultMarkup?: number;
        defaultBoarding?: number;
        defaultDelivery?: number;
    }) => void;
}

const ItemFormSettingsCard = <T extends SimpleFormField>({
    title,
    description,
    requiredFields,
    defaultSimpleMode,
    visibleFields,
    fields,
    onDefaultSimpleModeChange,
    onVisibleFieldsChange,
    defaultValues,
    onDefaultValuesChange,
}: ItemFormSettingsCardProps<T>) => {
    const activeFields = new Set(visibleFields);

    return (
        <Paper className={classes.exampleCard} radius="lg" p="md" withBorder>
            <Stack gap="sm">
                <Stack gap={4}>
                    <Title order={4}>{title}</Title>
                    <Text size="sm" c="dimmed">{description}</Text>
                </Stack>
                {defaultValues && onDefaultValuesChange && (
                    <ItemFormDefaultValues
                        values={{
                            defaultMarkup: defaultValues.markup,
                            defaultBoarding: defaultValues.boarding,
                            defaultDelivery: defaultValues.delivery,
                        }}
                        onChange={onDefaultValuesChange}
                    />
                )}
                <Paper className={classes.fieldGroup} radius="md" p="sm" withBorder>
                    <Stack gap="xs">
                        <Group justify="space-between" align="center">
                            <Title order={5}>Sempre visíveis no modo simples</Title>
                            <Badge
                                color="gray"
                                variant="light"
                                leftSection={<IconLock size={12} />}
                            >
                                Fixos
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Estes campos são essenciais e não podem ser ocultados.
                        </Text>
                        <Stack gap="xs">
                            {requiredFields.map((field) => (
                                <Group key={field.label} gap="xs" wrap="nowrap">
                                    <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                                        <IconLock size={12} />
                                    </ThemeIcon>
                                    <Stack gap={0}>
                                        <Text size="sm" fw={600}>{field.label}</Text>
                                        <Text size="xs" c="dimmed">{field.description}</Text>
                                    </Stack>
                                </Group>
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
                <SettingsOption
                    label="Iniciar no modo simples"
                    description="Este formulário começa no modo simples ao abrir."
                    checked={defaultSimpleMode}
                    onChange={onDefaultSimpleModeChange}
                />
                <Paper className={classes.fieldGroup} radius="md" p="sm" withBorder>
                    <Stack gap="xs">
                        <Group justify="space-between" align="center">
                            <Group gap="xs">
                                <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                                    <IconAdjustments size={14} />
                                </ThemeIcon>
                                <Title order={5}>Campos que você pode escolher</Title>
                            </Group>
                            <Badge color="gray" variant="light">Personalizáveis</Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Ative para mostrar o campo no modo simples. Se desativado, ele aparece apenas no modo completo.
                        </Text>
                        <Stack gap={0}>
                            {fields.map(({ id, label, description: fieldDescription }, index) => (
                                <div
                                    key={id}
                                    className={index === 0 ? undefined : classes.optionDivider}
                                >
                                    <SettingsOption
                                        label={label}
                                        description={fieldDescription}
                                        checked={activeFields.has(id)}
                                        onChange={(enabled) => onVisibleFieldsChange(id, enabled)}
                                    />
                                </div>
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Paper>
    );
};

export default ItemFormSettingsCard;
