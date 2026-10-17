// mantine
import { Button, Group } from "@mantine/core";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { incrementStep, decrementStep } from "../../redux/itemForm/itemFormStepsSlice";
import { ItemFormScope } from "../../redux/itemForm/itemFormSlice";
import { BudgetFormScope } from "../../redux/budgetForm/@rootReducer";

// components
import HandleButton from "./HandleButton";

const StepsButtons = ({ close, scope, budgetScope }: { close: () => void, scope: ItemFormScope, budgetScope: BudgetFormScope }) => {
  const dispatch = useDispatch<AppDispatch>();

  const step = useSelector((state: RootState) => state.itemForm.steps[scope].step);
  const itemReference = useSelector((state: RootState) => state.itemForm.form[scope].item_reference);

  const hasDescription = itemReference?.description!.trim().length > 0;

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
        <HandleButton scope={scope} budgetScope={budgetScope} close={close} />
      </Group>
    </>
  )
}

export default StepsButtons