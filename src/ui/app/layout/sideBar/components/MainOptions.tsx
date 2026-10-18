// react
import { useState } from 'react';

// mantine
import { Stack, FloatingIndicator } from "@mantine/core"

// styles
import classes from '../Sidebar.module.css';

// redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { setActivePage } from '../../store/layout.slice';

// components
import { SidebarPage } from './SidebarPage'; 

// icons
import { IconClipboardList, IconFiles, IconPencilPlus } from '@tabler/icons-react';

const MainOptions = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [active, setActive] = useState(0);
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

    const tabHandle = (index: number) => {
        setActive(index);
        dispatch(setActivePage(index));
    }

    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    }

    const pagesData = [
        { icon: IconPencilPlus, label: 'Create budget' },
        { icon: IconFiles, label: 'Budgets' },
        { icon: IconClipboardList, label: 'Items' }
    ]

    const tabs = pagesData.map((tab, index) => (
        <SidebarPage
            {...tab}
            ref={setControlRef(index)}
            key={tab.label}
            active={index === active}
            onClick={() => tabHandle(index)}
        />
    ))

    return (
        <Stack gap={0} ref={setRootRef} className={classes.mainOptions}>
            {tabs}

            <FloatingIndicator
                target={controlsRefs[active]}
                parent={rootRef}
                className={classes.indicator}
            />
        </Stack>
    )
}

export default MainOptions;