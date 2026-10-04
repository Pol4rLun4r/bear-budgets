// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import resetAllBudgetData from "../../../redux/budgetForm/resetAllBudgetData.thunk";
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";
import { setQuotation } from "../../../redux/budgetForm/quotationInfoSlice";
import { setListItems } from "../../../redux/budgetForm/items/listItemsSlice";

// api
import services from "../../../services";
import { useQueryClient } from "@tanstack/react-query";

/** botão para lidar com a criação e edição de um orçamento */
const BudgetButton = ({ scope }: { scope: BudgetFormScope }) => {
    const items = useSelector((state: RootState) => state.budgetForm.listItems[scope]);
    const quotation = useSelector((state: RootState) => state.budgetForm.quotationInfo[scope]);

    const dispatch = useDispatch<AppDispatch>();

    const hasValues = items.length > 0;

    const queryClient = useQueryClient()

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

            // invalida a lista
            queryClient.invalidateQueries({ queryKey: ['itemsData'] });

            await queryClient.refetchQueries({
                queryKey: ["budgetsData"],
            });

            notifications.show({
                title: scope === 'budget_form_create' ? 'Criado' : 'Editado',
                message: scope === 'budget_form_create' ? 'Orçamento criado com sucesso!' : 'Orçamento editado com sucesso!',
                position: 'bottom-right',
                color: 'teal'
            });

            // dispatch
            if (scope === 'budget_form_edit' && res.data && !Array.isArray(res.data)) {
                dispatch(setQuotation({ scope: 'budget_form_edit', data: res.data.quotation }))
                dispatch(setListItems({ scope: 'budget_form_edit', data: res.data.items }))
            };

            // reseta os dados da cotação para limpeza (atualmente limpa o formulário de criar cotação)
            resetAllBudgetData(dispatch, scope);

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
            disabled={!hasValues}
            onClick={() => handleBudget()}
        >
            {scope === 'budget_form_create' ? 'Criar Orçamento' : 'Salvar alterações'}
        </Button>
    )
}

export default BudgetButton;
