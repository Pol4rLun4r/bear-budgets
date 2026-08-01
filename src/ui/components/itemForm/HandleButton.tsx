// mantine
import { Button } from "@mantine/core";

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
    const convertedData: ItemDataState = { ...data, item_values: { ...data.item_values, st: stValue }, toggleStMode: false };

    const handleAddItem = () => {
        console.log('budgetCreate');
        dispatch(addItem({ scope: budgetScope, data: convertedData }));
        close();
        resetItem(dispatch, scope);
    };

    const handleAddItemBudgetEdit = () => {
        console.log('budgetEdit');
        dispatch(addItem({ scope: budgetScope, data: convertedData }));
        close();
        resetItem(dispatch, scope);
    };

    const handleEditItem = () => {
        console.log('edit item');
        dispatch(editItem({ scope: budgetScope, data: convertedData }));
        close();
        resetItem(dispatch, scope);
    }

    const handleButton = () => {
        if (scope === 'item_form_add') return handleAddItem();
        if (scope === 'item_form_add_budget_edit') return handleAddItemBudgetEdit();

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