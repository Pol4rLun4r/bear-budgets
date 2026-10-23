// react
import { JSX } from 'react';

// icons
import { IconClipboardList, IconFiles, IconPencilPlus } from '@tabler/icons-react';

// pages
import ComingSoon from '@/features/comingSoon/@ComingSoon';
import CreateBudget from '@/features/budgets/@CreateBudget';

export const pagesData = [
    { icon: IconPencilPlus, label: 'Criar orçamento', id: 'create-budget' },
    { icon: IconFiles, label: 'Orçamentos', id: 'budgets' },
    { icon: IconClipboardList, label: 'Itens', id: 'items' }
] as const;

export type PageId = typeof pagesData[number]['id'];

export const pageContentById: Record<PageId, () => JSX.Element> = {
    'create-budget': CreateBudget,
    'budgets': ComingSoon,
    'items': ComingSoon
}