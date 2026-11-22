import { Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import type { SettingsCategory } from '../settings.data';
import classes from '../Settings.module.css';

interface SettingsPanelProps {
    category: SettingsCategory;
}

const SettingsPanel = ({ category }: SettingsPanelProps) => (
    <Tabs.Panel value={category.value} className={classes.panel}>
        <Stack gap="lg">
            <Title order={3}>{category.label}</Title>
            <Paper className={classes.exampleCard} radius="lg" p="lg">
                <Text>{category.description}</Text>
            </Paper>
        </Stack>
    </Tabs.Panel>
);

export default SettingsPanel;
