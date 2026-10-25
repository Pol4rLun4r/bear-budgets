// mantine
import { Button, Group, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

// components
import HistoryPrice from "./historyPrice/@HistoryPrice";
import ItemValues from "./itemValues/@ItemValues";
import BudgetForm from "@/features/budget/budgetForm/@BudgetForm";

interface ItemDetailsProps {
    viewingBudget: boolean;
    onViewBudget: () => void;
    onRequestBack: () => void;
    closeBudget: () => void;
}

const ItemDetails = ({
    viewingBudget,
    onViewBudget,
    onRequestBack,
    closeBudget,
}: ItemDetailsProps) => {
    if (viewingBudget) {
        return (
            <Stack>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={onRequestBack}
                    >
                        Voltar aos detalhes
                    </Button>
                </Group>
                <BudgetForm scope="budget_form_edit" close={closeBudget} />
            </Stack>
        );
    }

    return (
        <Group grow align="stretch">
            <HistoryPrice />
            <ItemValues onViewBudget={onViewBudget} />
        </Group>
    )
}

export default ItemDetails;