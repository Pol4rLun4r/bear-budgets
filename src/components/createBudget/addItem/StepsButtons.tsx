// mantine
import { Button, Group } from "@mantine/core";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { incrementStep, decrementStep } from "../../../redux/createBudget/items/addItemStepsSlice";
import { addItem } from "../../../redux/createBudget/items/listItemsSlice";
import resetAddItem from "../../../redux/createBudget/items/resetAddItem.thunk";

const StepsButtons = ({ close }: { close: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const step = useSelector((state: RootState) => state.createBudget.addItemSteps.step);
  const itemBasicData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
  const itemValues = useSelector((state: RootState) => state.createBudget.addItem.values);

  const data = useSelector((state: RootState) => state.createBudget.addItem)

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
    dispatch(resetAddItem);
  };

  return (
    <>
      {step === 0 ? (
        <Button
          radius='lg'
          variant="light"
          onClick={() => dispatch(incrementStep())}
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
            onClick={() => dispatch(decrementStep())}
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