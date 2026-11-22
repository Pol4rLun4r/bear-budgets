// mantine
import { Button, Group } from "@mantine/core";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope } from "../store/itemForm.slice";
import { getStepState, isHasDescription } from "../store/itemForm.selectors";
import { decrementStep, incrementStep } from "../store/steps.slice";
import { BudgetFormScope } from "../../budgetForm/store/@rootReducer";
import { submitItemForm } from "../store/submitItemForm.thunk";

// components
import HandleButton from "./HandleButton";

interface StepsButtonsProps {
  closeModal: () => void;
  scope: ItemFormScope;
  budgetScope: BudgetFormScope;
}

const StepsButtons = ({ scope, closeModal, budgetScope }: StepsButtonsProps) => {
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => getStepState(state, scope));
  const hasDescription = useAppSelector((state) => isHasDescription(state, scope))

  const handleButton = (
    <HandleButton
      scope={scope}
      budgetScope={budgetScope}
      closeModal={closeModal}
      isFirstStep={step === 0}
      onSubmit={async () => {
        await dispatch(submitItemForm({ scope, budgetScope })).unwrap();
      }}
    />
  );

  return (
    <>
      <Group grow>
        {step === 0 ? (
          <>
            {handleButton}
            <Button
              radius='lg'
              variant="gradient"
              onClick={() => dispatch(incrementStep(scope))}
              disabled={!hasDescription}
            >
              Definir valores do item
            </Button>
          </>
        ) : (
          <>
            <Group grow>
              <Button
                radius='lg'
                variant="light"
                color="violet"
                onClick={() => dispatch(decrementStep(scope))}
              >
                Voltar
              </Button>
            </Group>
            {handleButton}
          </>
        )}
      </Group>
    </>
  )
}

export default StepsButtons