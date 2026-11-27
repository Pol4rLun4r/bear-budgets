import { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import SettingsNavigation from './SettingsNavigation';
import SettingsPanel from './SettingsPanel';
import SettingsGeneralPanel from './SettingsGeneralPanel';
import SettingsInterfacePanel from './SettingsInterfacePanel';
import SettingsMarginsPanel from './SettingsMarginsPanel';
import { settingsCategories } from '../settings.data';
import { updateSettings } from '../store/settings.slice';
import classes from '../Settings.module.css';

interface SettingsTabsProps {
    onDirtyChange: (dirty: boolean) => void;
    onRequestClose: () => void;
}

const applyUpdate = (settings: AppSettings, update: SettingsUpdate): AppSettings => {
    const nextSettings = update.general
        ? {
            ...settings,
            general: { ...settings.general, ...update.general },
        }
        : settings;
    const interfaceUpdate = update.interface;
    if (!interfaceUpdate) return nextSettings;

    const nextInterface = { ...settings.interface };
    if (interfaceUpdate.budgetTable) {
        nextInterface.budgetTable = {
            ...settings.interface.budgetTable,
            ...interfaceUpdate.budgetTable,
        };
    }

    if (interfaceUpdate.itemForm) {
        nextInterface.itemForm = {
            ...settings.interface.itemForm,
            ...(interfaceUpdate.itemForm.itemReference && {
                itemReference: {
                    ...settings.interface.itemForm.itemReference,
                    ...interfaceUpdate.itemForm.itemReference,
                },
            }),
            ...(interfaceUpdate.itemForm.itemValues && {
                itemValues: {
                    ...settings.interface.itemForm.itemValues,
                    ...interfaceUpdate.itemForm.itemValues,
                },
            }),
        };
    }

    return {
        ...nextSettings,
        interface: nextInterface,
    };
};

const SettingsTabs = ({ onDirtyChange, onRequestClose }: SettingsTabsProps) => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings.value);
    const pendingWrites = useAppSelector((state) => state.settings.pendingWrites);
    const [draft, setDraft] = useState<AppSettings | null>(settings);
    const dirty = Boolean(draft && settings && JSON.stringify(draft) !== JSON.stringify(settings));

    useEffect(() => {
        onDirtyChange(dirty);
    }, [dirty, onDirtyChange]);

    const updateDraft = (update: SettingsUpdate) => {
        setDraft((current) => current ? applyUpdate(current, update) : current);
    };

    const saveDraft = async () => {
        if (!draft || !dirty || pendingWrites > 0) return;

        try {
            const savedSettings = await dispatch(
                updateSettings({ general: draft.general, interface: draft.interface }),
            ).unwrap();
            setDraft(savedSettings);
        } catch (error) {
            notifications.show({
                color: 'red',
                title: 'Erro ao salvar configurações',
                message: error instanceof Error ? error.message : 'Tente novamente.',
            });
        }
    };

    return (
        <Tabs
            defaultValue="general"
            orientation="vertical"
            variant="pills"
            keepMounted={false}
            className={classes.tabs}
        >
            <SettingsNavigation categories={settingsCategories} />
            {settingsCategories.map((category) => category.value === 'general'
                ? (
                    <SettingsGeneralPanel
                        key={category.value}
                        settings={draft?.general}
                        dirty={dirty}
                        saving={pendingWrites > 0}
                        onChange={updateDraft}
                        onSave={() => void saveDraft()}
                        onRequestClose={onRequestClose}
                    />
                )
                : category.value === 'interface'
                ? (
                    <SettingsInterfacePanel
                        key={category.value}
                        settings={draft?.interface}
                        dirty={dirty}
                        saving={pendingWrites > 0}
                        onChange={updateDraft}
                        onSave={() => void saveDraft()}
                        onRequestClose={onRequestClose}
                    />
                )
                : category.value === 'margins'
                ? <SettingsMarginsPanel key={category.value} />
                : <SettingsPanel key={category.value} category={category} />
            )}
        </Tabs>
    );
};

export default SettingsTabs;
