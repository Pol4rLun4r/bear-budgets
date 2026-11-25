// mantine
import { Button, Group, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

// components
import RightSection from "./rightSection/@RightSection";
import BudgetForm from "@/features/budget/budgetForm/@BudgetForm";
import LeftSection from "./leftSection/@LeftSection";

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
            <Stack h="100%" style={{ minHeight: 0 }}>
                <Group flex="0 0 auto">
                    <Button
                        variant="light"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={onRequestBack}
                    >
                        Voltar aos detalhes
                    </Button>
                </Group>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <BudgetForm scope="budget_form_edit" close={closeBudget} />
                </div>
            </Stack>
        );
    }

    return (
        <Group grow align="stretch">
            <LeftSection />
            <RightSection onViewBudget={onViewBudget} />
        </Group>
    )
}

export default ItemDetails;