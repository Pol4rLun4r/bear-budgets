import { Group, Stack, Tabs, Title } from '@mantine/core';
import type { SettingsCategory } from '../settings.data';
import classes from '../Settings.module.css';

interface SettingsNavigationProps {
    categories: SettingsCategory[];
}

const SettingsNavigation = ({ categories }: SettingsNavigationProps) => (
    <Stack className={classes.navigationContainer} gap="md">
        <Title order={3}>Configurações</Title>
        <Tabs.List className={classes.navigation}>
            {categories.map((category) => (
                <Tabs.Tab
                    key={category.value}
                    value={category.value}
                    disabled={category.disabled}
                    className={classes.navigationTab}
                >
                    <Group gap={6} wrap="nowrap">
                        {category.icon}
                        {category.label}
                    </Group>
                </Tabs.Tab>
            ))}
        </Tabs.List>
    </Stack>
);

export default SettingsNavigation;
