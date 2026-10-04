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

const HandleButton = ({ scope, budgetScope, close }: { close: () => void, scope: ItemFormScope, budgetScope: BudgetFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();

    const itemReference = useSelector((state: RootState) => state.itemForm.form[scope].item_reference);
    const itemValues = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

    const hasDescription = itemReference?.description!.trim().length > 0;

    const hasValues =
        isDefinedNonNegative(itemValues.quantity) &&
        isDefinedMarkup(itemValues.markup) &&
        hasDescription;

    // dados do item bruto
    const data = useSelector((state: RootState) => state.itemForm.form[scope]);
    const { stValue } = useCalcAddItem({ ...data.item_values, switchStMode: data.toggleStMode });
    const convertedItemData: ItemDataState = { ...data, item_values: { ...data.item_values, st: stValue }, toggleStMode: false };

    const notification = () => {
        return notifications.show({
            title: scope === 'item_form_edit' ? 'Item atualizado' : 'Item adicionado',
            message: scope === 'item_form_edit' ? 'Item da cotação atualizado com sucesso!' : 'Novo item adicionado à cotação com sucesso!',
            position: 'bottom-right',
            color: 'teal'
        });
    }

    const handleDispatchAddItem = () => {
        dispatch(addItem({ scope: budgetScope, data: convertedItemData }));
        close();
        resetItem(dispatch, scope);
        notification();
    }

    const handleDispatchEditItem = () => {
        dispatch(editItem({ scope: budgetScope, data: convertedItemData }));
        close();
        resetItem(dispatch, scope);
        notification();
    }

    const handleButton = () => {
        // se for um formulário para edição do item, irá salvar no scope de "edição"
        if (scope === 'item_form_edit') return handleDispatchEditItem();

        // se for um formulário para adicionar um item, irá salvar no scope de "adicionar"
        // (abrange os dois forms, tanto para adicionar em uma nova cotação, como adicionar em uma cotação existente)
        return handleDispatchAddItem();
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