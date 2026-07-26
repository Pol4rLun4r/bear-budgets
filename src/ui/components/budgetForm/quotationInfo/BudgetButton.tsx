// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import resetAllCreateBudgetData from "../../../redux/createBudget/resetAllCreateBudgetData.thunk";
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";

// api
import services from "../../../services";

/** botão para lidar com a criação e edição de um orçamento */
const BudgetButton = ({ scope }: { scope: BudgetFormScope }) => {
    const items = useSelector((state: RootState) => state.budgetForm.listItems[scope]);
    const quotation = useSelector((state: RootState) => state.budgetForm.quotationInfo[scope]);

    const dispatch = useDispatch<AppDispatch>();

    const hasValues = items.length > 0;

    const budgetData: CreateQuotation = {
        quotation,
        items
    };

    const handleBudget = async () => {
        try {
            const res = await services.quotation.create(budgetData);

            if (!res.success) {
                return notifications.show({
                    title: 'Error ao criação cotação',
                    message: res.data,
                    position: 'bottom-right',
                    color: 'pink'
                })
            }

            notifications.show({
                title: 'Criado',
                message: 'Orçamento criado com sucesso!',
                position: 'bottom-right',
                color: 'teal'
            });

            dispatch(resetAllCreateBudgetData);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
        }
    };

    return (
        <Button
            variant="gradient"
            radius="lg"
            size="md"
            w={250}
            disabled={!hasValues || scope === 'budget_edit'}
            onClick={() => handleBudget()}
        >
            {scope === 'budget_create' ? 'Criar Orçamento' : 'Salvar alterações'}
        </Button>
    )
}

export default BudgetButton;
