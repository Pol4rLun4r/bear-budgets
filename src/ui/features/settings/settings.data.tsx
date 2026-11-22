import type { ReactNode } from 'react';
import {
    IconAdjustments,
    IconColorSwatch,
    IconDeviceDesktop,
    IconFolder,
} from '@tabler/icons-react';

export interface SettingsCategory {
    value: string;
    label: string;
    description: string;
    icon: ReactNode;
    disabled: boolean;
}

export const settingsCategories: SettingsCategory[] = [
    {
        value: 'general',
        label: 'Geral',
        description: 'Preferências gerais do aplicativo serão adicionadas aqui.',
        icon: <IconAdjustments size={18} stroke={1.5} />,
        disabled: true,
    },
    {
        value: 'interface',
        label: 'Interface',
        description: 'Personalize como as informações são exibidas nas telas do aplicativo.',
        icon: <IconDeviceDesktop size={18} stroke={1.5} />,
        disabled: false,
    },
    {
        value: 'appearance',
        label: 'Aparência',
        description: 'Preferências de aparência e tema serão adicionadas aqui.',
        icon: <IconColorSwatch size={18} stroke={1.5} />,
        disabled: true,
    },
    {
        value: 'files',
        label: 'Arquivos',
        description: 'Preferências de arquivos serão adicionadas aqui.',
        icon: <IconFolder size={18} stroke={1.5} />,
        disabled: true,
    },
];
