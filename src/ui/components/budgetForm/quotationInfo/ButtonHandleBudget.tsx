// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import resetAllBudgetData from "../../../redux/budgetForm/resetAllBudgetData.thunk";
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";
import { hasBudgetChanged } from "../../../utils/budgetComparison";

// api
import services from "../../../services";
import { useQueryClient } from "@tanstack/react-query";

/** botão para lidar com a criação e edição de um orçamento */
const ButtonHandleBudget = ({ scope , close}: { close?: () => void, scope: BudgetFormScope }) => {
    const items = useSelector((state: RootState) => state.budgetForm.listItems[scope]); // pega os items do orçamento do estado do redux
    const quotation = useSelector((state: RootState) => state.budgetForm.quotationInfo[scope]); // pega a cotação do estado do redux
    const originalBudget = useSelector((state: RootState) => state.budgetForm.originalBudget); // pega o orçamento original do estado do redux

    const dispatch = useDispatch<AppDispatch>();

    // verifica se há itens no orçamento
    const hasValues = items.length > 0;

    // verifica se houve alterações no orçamento original
    const hasChanges = scope === "budget_form_edit" &&
        originalBudget !== null &&
        hasBudgetChanged(originalBudget, { quotation, items });

    const queryClient = useQueryClient()

    // função para lidar com a criação ou edição do orçamento
    const handleBudget = async () => {
        let res: Result<QuotationLink[] | undefined> | Result<QuotationFull | undefined>

        if (scope === 'budget_form_create') {
            // dados para criar um orçamento novo
            const createBudgetData: CreateQuotation = { quotation, items };

            // service para criar um orçamento
            res = await services.quotation.create(createBudgetData);
        } else {
            const editBudgetData: UpdateQuotation = { quotation, items } as UpdateQuotation

            // service para editar um orçamento
            res = await services.quotation.update(editBudgetData);
        }

        try {
            if (!res.success) {
                return notifications.show({
                    title: scope === 'budget_form_create' ? 'Error ao criação cotação' : 'Erro ao editar cotação',
                    message: res.data,
                    position: 'bottom-right',
                    color: 'pink'
                })
            }

            // invalida a lista de items
            queryClient.invalidateQueries({ queryKey: ['itemsData'] });

            // força a refetch da lista de orçamentos para atualizar a tela
            await queryClient.refetchQueries({
                queryKey: ["budgetsData"],
            });

            notifications.show({
                title: scope === 'budget_form_create' ? 'Criado' : 'Editado',
                message: scope === 'budget_form_create' ? 'Orçamento criado com sucesso!' : 'Orçamento editado com sucesso!',
                position: 'bottom-right',
                color: 'teal'
            });

            // fecha o modal da cotação
            if (scope === 'budget_form_edit') close!();

            // reseta os dados da cotação para limpeza (atualmente limpa o formulário de criar cotação)
            resetAllBudgetData(dispatch);

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
            disabled={scope === "budget_form_create" ? !hasValues : !hasChanges}
            onClick={() => handleBudget()}
        >
            {scope === 'budget_form_create' ? 'Criar Orçamento' : 'Salvar alterações'}
        </Button>
    )
}

export default ButtonHandleBudget;
