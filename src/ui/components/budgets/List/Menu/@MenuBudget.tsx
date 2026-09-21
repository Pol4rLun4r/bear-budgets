import { useState } from "react";

// mantine
import { ActionIcon, Group, Loader, Menu } from "@mantine/core";

// icons
import { IconCopyPlus, IconEyeSpark, IconMenu3, IconTrash } from "@tabler/icons-react";
import services from '../../../../services/index';

// redux
import { setListItems } from "../../../../redux/budgetForm/items/listItemsSlice";
import { setQuotation } from "../../../../redux/budgetForm/quotationInfoSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

const MenuBudget = ({
    quotationId,
    open
}: {
    quotationId: Quotation['id'],
    open: () => void
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    const handleSeeData = async () => {
        open();
        setLoading(true);

        try {
            const result = await services.quotation.getFull(quotationId);

            if (!result.success || !result.data) return;

            dispatch(setListItems({
                scope: 'budget_form_edit',
                data: result.data?.items ?? []
            }));

            dispatch(setQuotation({
                scope: 'budget_form_edit',
                data: result.data.quotation
            }));

        } catch (error) {
            console.error('Erro ao buscar orçamento:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Group>
            <Menu shadow="md" withArrow offset={-1}>
                <Menu.Target>
                    <ActionIcon variant="transparent">
                        <IconMenu3 />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconCopyPlus size={14} />}
                        disabled
                    >
                        Duplicar Orçamento
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        disabled
                    >
                        Deletar Orçamento
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <ActionIcon onClick={() => handleSeeData()} variant="transparent">
                {loading ? <Loader size={16} /> : <IconEyeSpark />}
            </ActionIcon>
        </Group>
    )
}

export default MenuBudget