import { useState } from "react";

// mantine
import { ActionIcon, Group, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// icons
import { IconCopyPlus, IconEyeSpark, IconMenu3, IconTrash } from "@tabler/icons-react";
import services from '../../../../services/index';
import BudgetForm from "../../../budgetForm/@BudgetForm";

// redux
import { setListItems } from "../../../../redux/budgetForm/items/listItemsSlice";
import { setQuotation } from "../../../../redux/budgetForm/quotationInfoSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

const MenuBudget = ({ quotationId }: { quotationId: Quotation['id'] }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [quotation, setQuotationData] = useState<Quotation | undefined>(undefined);
    // const [loading, setLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleSeeData = () => {
        const fetchQuotation = async () => {
            // setLoading(true);
            try {
                const result = await services.quotation.getFull(quotationId);
                if (result.success) {
                    const items = result.data?.items

                    setQuotationData(result.data?.quotation);
                    dispatch(setListItems({ scope: 'budget_form_edit', data: items! }));
                    dispatch(setQuotation({ scope: 'budget_form_edit', data: result.data!.quotation! }));
                } else {
                    console.error('Erro ao buscar orçamento:', result.data);
                }
            } catch (error) {
                console.error('Erro ao buscar orçamento:', error);
            } finally {
                // setLoading(false);
            }
        };

        fetchQuotation();
        open();
    }

    const quotationNumber = String(quotation?.id).padStart(6, "0");

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

            <Modal
                padding='xl'
                size="100%"
                opened={opened}
                onClose={close}
                title={"Informações do Orçamento Nº " + quotationNumber}
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <BudgetForm scope="budget_form_edit" />
            </Modal>
            <ActionIcon onClick={() => handleSeeData()} variant="transparent">
                <IconEyeSpark />
            </ActionIcon>
        </Group>
    )
}

export default MenuBudget