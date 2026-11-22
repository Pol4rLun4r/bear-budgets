import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { Group, Stack, Switch, Text } from '@mantine/core';

interface SettingsOptionProps {
    label: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

const SettingsSwitch = memo(({
    label,
    checked,
    disabled,
    onChange,
}: {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <Switch
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
    />
));

const SettingsOption = ({
    label,
    description,
    checked,
    disabled,
    onChange,
}: SettingsOptionProps) => {
    const onChangeRef = useRef(onChange);
    useLayoutEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    const handleChange = useCallback(
        (nextValue: boolean) => onChangeRef.current(nextValue),
        [],
    );

    return (
        <Group justify="space-between" wrap="nowrap" mih="3.5rem">
            <Stack gap={4}>
                <Text size="sm" fw={500}>{label}</Text>
                <Text size="xs" c="dimmed">{description}</Text>
            </Stack>
            <SettingsSwitch
                label={label}
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
            />
        </Group>
    );
};

export default SettingsOption;
