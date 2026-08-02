// mantine
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// utils
import { isDefinedMarkup, isDefinedNonNegative } from "../../utils/itemFormValidation";
import useCalcAddItem from "../../utils/calcAddItem";

// redux
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BudgetFormScope } from "../../redux/budgetForm/@rootReducer";
import { ItemDataState, ItemFormScope } from "../../redux/itemForm/itemFormSlice";
import { addItem, editItem } from "../../redux/budgetForm/items/listItemsSlice";
import resetItem from "../../redux/itemForm/resetItem.thunk";

// services
import services from "../../services";

// query
import { useQueryClient } from "@tanstack/react-query";

const HandleButton = ({ scope, budgetScope, close }: { close: () => void, scope: ItemFormScope, budgetScope: BudgetFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();

    const queryClient = useQueryClient();

    const itemReference = useSelector((state: RootState) => state.itemForm.form[scope].item_reference);
    const itemValues = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

    const hasDescription = itemReference?.description!.trim().length > 0;

    const hasValues =
        isDefinedNonNegative(itemValues.quantity) &&
        isDefinedMarkup(itemValues.markup) &&
        hasDescription;

    // dados do item bruto
    const data = useSelector((state: RootState) => state.itemForm.form[scope]);
    const { stValue, totalWithAll } = useCalcAddItem({ ...data.item_values, switchStMode: data.toggleStMode });
    const convertedItemData: ItemDataState = { ...data, item_values: { ...data.item_values, st: stValue }, toggleStMode: false };
    const quotationData = useSelector((state: RootState) => state.budgetForm.quotationInfo[budgetScope]);
    const items = useSelector((state: RootState) => state.budgetForm.listItems[budgetScope]).length;

    const handleDispatchAddItem = () => {
        dispatch(addItem({ scope: budgetScope, data: convertedItemData }));
        close();
        resetItem(dispatch, scope);
    }

    const handleService = async () => {
        try {
            let res;

            if (scope === 'item_form_edit') {
                res = await services.quotation.updateLine(convertedItemData as UpdateQuotationLinePayload);
            } else {
                res = await services.item.addItemToQuotation({
                    quotation: {
                        id: quotationData.id,
                        amount: quotationData.amount + 1,
                        total_value: quotationData.total_value + totalWithAll
                    },
                    items: [{
                        ...convertedItemData,
                        item_values: {
                            ...convertedItemData.item_values,
                            position: items + 1
                        },
                    }]
                });
            }

            if (!res.success) {
                return notifications.show({
                    title: scope === 'item_form_edit' ? 'Error ao atualizar item da cotação' : 'Error ao adicionar novo item na cotação',
                    message: res.data,
                    position: 'bottom-right',
                    color: 'pink'
                })
            }

            if (scope === 'item_form_edit') {
                console.log();
            } else {
                handleDispatchAddItem();
            }

            await queryClient.refetchQueries({
                queryKey: ["budgetsData"],
            });

            notifications.show({
                title: scope === 'item_form_edit' ? 'Item atualizado' : 'Item adicionado',
                message: scope === 'item_form_edit' ? 'Item da cotação atualizado com sucesso!' : 'Novo item adicionado à cotação com sucesso!',
                position: 'bottom-right',
                color: 'teal'
            });

            // dispatch(resetAllCreateBudgetData);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
        }
    }

    const handleAddItem = () => {
        if (budgetScope === 'budget_form_edit') {
            return handleService();
        }

        handleDispatchAddItem();
    };

    const handleEditItem = () => {
        if (budgetScope === 'budget_form_edit') {
            handleService();
        }

        dispatch(editItem({ scope: budgetScope, data: convertedItemData }));
        close();
        resetItem(dispatch, scope);
    }

    const handleButton = () => {
        if (scope === 'item_form_add') return handleAddItem();
        if (scope === 'item_form_add_budget_edit') return handleAddItem();

        return handleEditItem();
    }

    return (
        <Button
            radius='lg'
            variant="gradient"
            onClick={() => handleButton()}
            disabled={!hasValues}
        >
            {scope === "item_form_edit" ? "Salvar alterações" : "Adicionar item"}
        </Button>
    )
};

export default HandleButton