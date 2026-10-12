import { useState } from "react";

// mantine
import { ActionIcon, Group, Loader, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// icons
import { IconCopyPlus, IconEyeSpark, IconMenu3, IconTrash } from "@tabler/icons-react";
import services from '../../../../services/index';

// redux
import { setListItems } from "../../../../redux/budgetForm/items/listItemsSlice";
import { setQuotation } from "../../../../redux/budgetForm/quotationInfoSlice";
import { setOriginalBudget } from "../../../../redux/budgetForm/originalBudgetSlice";
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

    // função para buscar os dados do orçamento e atualizar o estado do redux
    const handleSeeData = async () => {
        open();
        setLoading(true);
        dispatch(setOriginalBudget(null));

        try {
            const result = await services.quotation.getFull(quotationId);

            if (!result.success || !result.data) return;

            const items = result.data.items.map((item) => ({
                ...item,
                temp_id: "",
                toggleStMode: false,
            }));

            // atualiza o estado do redux com os items
            dispatch(setListItems({
                scope: 'budget_form_edit',
                data: items
            }));

            // atualiza o estado do redux com a cotação
            dispatch(setQuotation({
                scope: 'budget_form_edit',
                data: result.data.quotation
            }));

            // atualiza o estado do redux com o orçamento original
            dispatch(setOriginalBudget({
                quotation: result.data.quotation,
                items,
            }));
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
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