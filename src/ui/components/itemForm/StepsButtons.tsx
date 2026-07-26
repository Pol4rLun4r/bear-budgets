// mantine
import { Button, Group } from "@mantine/core";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { incrementStep, decrementStep } from "../../redux/itemForm/itemFormStepsSlice";
import { addItem, editItem } from "../../redux/createBudget/items/listItemsSlice";
import { ItemDataState, ItemFormScope } from "../../redux/itemForm/itemFormSlice";
import resetItem from "../../redux/itemForm/resetItem.thunk";

// util
import useCalcAddItem from "../../utils/calcAddItem";

const StepsButtons = ({ close, scope }: { close: () => void, scope: ItemFormScope }) => {
  const dispatch = useDispatch<AppDispatch>();

  const step = useSelector((state: RootState) => state.itemForm.steps[scope].step);
  const itemReference = useSelector((state: RootState) => state.itemForm.form[scope].item_reference);
  const itemValues = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

  // dados do item bruto
  const data = useSelector((state: RootState) => state.itemForm.form[scope]);

  const { stValue } = useCalcAddItem({ ...data.item_values, switchStMode: data.toggleStMode });

  const convertedData: ItemDataState = { ...data, item_values: { ...data.item_values, st: stValue }, toggleStMode: false };

  const hasDescription = itemReference?.description!.trim().length > 0;

  // quantity: definido e maior ou iguai a zero
  const isDefinedNonNegative = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    const n = Number(value);
    return Number.isFinite(n) && n > 0;
  };

  // markup: definido e número finito (pode ser negativo)
  const isDefinedMarkup = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return Number.isFinite(Number(value));
  };

  const hasValues =
    isDefinedNonNegative(itemValues.quantity) &&
    isDefinedMarkup(itemValues.markup) &&
    hasDescription;

  const handleAddItem = () => {
    dispatch(addItem(convertedData));
    close();
    resetItem(dispatch, scope);
  };

  const handleEditItem = () => {
    dispatch(editItem(convertedData));
    close();
    resetItem(dispatch, scope);
  }

  return (
    <>
      <Group grow>
        {step === 0 ? (
          <Button
            radius='lg'
            variant="light"
            onClick={() => dispatch(incrementStep(scope))}
            disabled={!hasDescription}
          >
            Definir valores do item
          </Button>
        ) : (
          <Group grow>
            <Button
              radius='lg'
              variant="default"
              c='dimmed'
              onClick={() => dispatch(decrementStep(scope))}
            >
              Voltar
            </Button>
          </Group>
        )}
        <Button
          radius='lg'
          variant="gradient"
          onClick={() => scope === "create_budget_add" ? handleAddItem() : scope === "create_budget_edit" ? handleEditItem() : 'função de editar um item fora do orçamento'}
          disabled={!hasValues}
        >
          {scope === "create_budget_add" ? "Adicionar item" : "Salvar alterações"}
        </Button>
      </Group>
    </>
  )
}

export default StepsButtons