// styles
import classes from './FrameBar.module.css';

// redux
import { RootState } from '../../redux/store.ts';
import { useSelector } from 'react-redux';

// icons
import { IconMaximize, IconMinus, IconX } from '@tabler/icons-react';
import { ActionIcon, ActionIconProps, Group } from '@mantine/core';

const FrameBar = () => {
    const tabState = useSelector((state: RootState) => state.sidebar.tab.activeTab);

    interface Props extends HTMLOrSVGElement, ActionIconProps { }

    const iconSize = '1.2rem';
    const actionIconProps: Partial<Props> = {
        size: 'lg',
        radius: 'lg',
        variant: 'transparent',
        tabIndex: -1,
        className: classes.mainButton
    };

    const tabs = [
        'Create budget',
        'Budgets',
        'Coming soon',
        'Coming soon'
    ];

    return (
        <div className={classes.frameBar} >
            <div style={{ justifySelf: 'center' }}>{tabs[tabState]}</div>
            <Group gap={2}>
                <ActionIcon {...actionIconProps}>
                    <IconMinus size={iconSize} />
                </ActionIcon>
                <ActionIcon {...actionIconProps}>
                    <IconMaximize size={iconSize} /> {/* IconLayersSubtract */}
                </ActionIcon>
                <ActionIcon {...actionIconProps}>
                    <IconX size={iconSize} />
                </ActionIcon>
            </Group>
        </div>
    )
}

export default FrameBar;