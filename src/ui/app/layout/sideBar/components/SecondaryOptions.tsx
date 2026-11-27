// styles
import classes from '../Sidebar.module.css'

// mantine
import { Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

// icons
import { IconSettings2 } from '@tabler/icons-react'

// components
import { SidebarPage } from './SidebarPage';
import UpdateOption from '@/features/update/UpdateOption';
import { ChangeLog } from '@/features/update/changeLog/@ChangeLog';
import SettingsModal from '@/features/settings/SettingsModal';

const SecondaryOptions = () => {
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

    return (
        <Stack gap={0} className={classes.secondaryOptions}>
            <UpdateOption />
            <ChangeLog />
            <SidebarPage
                icon={IconSettings2}
                label='Configurações'
                onClick={openSettings}
            />
            <SettingsModal opened={settingsOpened} onClose={closeSettings} />
        </Stack>
    )
};

export default SecondaryOptions;