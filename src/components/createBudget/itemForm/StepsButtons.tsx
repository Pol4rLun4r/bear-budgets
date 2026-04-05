// mantine
import { Button, Group } from "@mantine/core";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { incrementStep, decrementStep } from "../../../redux/createBudget/items/itemFormStepsSlice";
import { addItem } from "../../../redux/createBudget/items/listItemsSlice";
import { ItemFormScope } from "../../../redux/createBudget/items/itemFormSlice";
import resetAddItem from "../../../redux/createBudget/items/resetItem.thunk";

const StepsButtons = ({ close, scope }: { close: () => void, scope: ItemFormScope }) => {
  const dispatch = useDispatch<AppDispatch>();

  const step = useSelector((state: RootState) => state.createBudget.itemFormSteps[scope].step);
  const itemBasicData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_basic_data);
  const itemValues = useSelector((state: RootState) => state.createBudget.itemForm[scope].values);

  const data = useSelector((state: RootState) => state.createBudget.itemForm[scope]);

  const hasDescription = itemBasicData.description.trim().length > 0;

  // unit_price e quantity: definidos e maiores ou iguais a zero
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
    isDefinedNonNegative(itemValues.unit_price) &&
    isDefinedNonNegative(itemValues.quantity) &&
    isDefinedMarkup(itemValues.markup);

  const handleAddItem = () => {
    dispatch(addItem(data));
    close();
    resetAddItem(dispatch, scope);
  };

  return (
    <>
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
          <Button
            radius='lg'
            variant="light"
            onClick={() => handleAddItem()}
            disabled={!hasValues}
          >
            Criar item
          </Button>
        </Group>
      )}
    </>
  )
}

export default StepsButtons