import { useEffect, useState } from 'react';
import { Group, Loader, Text } from '@mantine/core';
import classes from '../Settings.module.css';

const SettingsSaveStatus = ({ pendingWrites }: { pendingWrites: number }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (pendingWrites === 0) return;

        const showTimer = window.setTimeout(() => setVisible(true), 1000);
        return () => window.clearTimeout(showTimer);
    }, [pendingWrites]);

    if (pendingWrites === 0 || !visible) return null;

    return (
        <Group gap={6} className={classes.saveStatus} aria-live="polite">
            <Loader size={14} />
            <Text size="xs">Salvando…</Text>
        </Group>
    );
};

export default SettingsSaveStatus;
