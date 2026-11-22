// mantine
import { Divider, Stack, Stepper } from "@mantine/core";
import { useEffect } from "react";

// redux
import type { ItemFormScope } from "./store/itemForm.slice";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getStepState } from "./store/itemForm.selectors";
import { setSwitchModes } from "./store/switch.slice";
import { BudgetFormScope } from "../budgetForm/store/@rootReducer";

// components
import ItemReference from "./components/itemReference/@ItemReference";
import SwitchMode from "./components/SwitchMode";
import ItemValues from "./components/ItemValues/@ItemValues";
import StepsButtons from "./components/StepsButtons";

interface ItemFormProps {
  opened: boolean,
  closeModal: () => void,
  scope: ItemFormScope,
  budgetScope: BudgetFormScope,
  showInlineCalc?: boolean,
}

const ItemForm = ({ opened, scope, closeModal, budgetScope, showInlineCalc = true }: ItemFormProps) => {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => getStepState(state, scope));
  const referenceDefaultSimpleMode = useAppSelector(
    (state) => state.settings.value?.interface.itemForm.itemReference.defaultSimpleMode ?? false,
  );
  const valuesDefaultSimpleMode = useAppSelector(
    (state) => state.settings.value?.interface.itemForm.itemValues.defaultSimpleMode ?? false,
  );

  useEffect(() => {
    if (!opened) return;

    dispatch(setSwitchModes({
      item_reference: referenceDefaultSimpleMode,
      item_values: valuesDefaultSimpleMode,
    }));
  }, [dispatch, opened, referenceDefaultSimpleMode, valuesDefaultSimpleMode]);

  return (
    <Stack gap={"xl"}>
      <SwitchMode mode={step === 0 ? "item_reference" : "item_values"} />
      <Stepper active={step} size="sm" radius="xl">
        <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
          <ItemReference scope={scope} />
        </Stepper.Step>
        <Stepper.Step label="Valores" description="Defina os valores do item">
          <ItemValues scope={scope} showInlineCalc={showInlineCalc} />
        </Stepper.Step>
      </Stepper>
      <Divider />
      <StepsButtons scope={scope} closeModal={closeModal} budgetScope={budgetScope} />
    </Stack>
  )
}

export default ItemForm;