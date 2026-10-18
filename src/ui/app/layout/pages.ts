// icons
import { IconClipboardList, IconFiles, IconPencilPlus } from '@tabler/icons-react';

export const pagesData = [
    { icon: IconPencilPlus, label: 'Criar orçamento', id: 'create-budget' },
    { icon: IconFiles, label: 'Orçamentos', id: 'budgets' },
    { icon: IconClipboardList, label: 'Itens', id: 'items' }
] as const;

export type PageId = typeof pagesData[number]['id'];