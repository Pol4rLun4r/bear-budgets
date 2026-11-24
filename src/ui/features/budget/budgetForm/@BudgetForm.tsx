import { useEffect, useRef, useState } from "react";

// components
import Items from "./components/itemTable/@ItemTable";
import QuotationInfo from './components/quotationInfo/@QuotationInfo';

// redux
import { BudgetFormScope } from "./store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setMode } from "./store/itemTableSwitch.slice";
import { setTagEditingEnabled } from "./store/itemTable.slice";

// styles
import classes from './budgetForm.module.css'

const BudgetForm = ({ scope, close }: { close?: () => void, scope: BudgetFormScope }) => {
  const dispatch = useAppDispatch();
  const defaultSimpleMode = useAppSelector(
    (state) => state.settings.value?.interface.budgetTable.defaultSimpleMode ?? true,
  );
  const defaultTagEditingEnabled = useAppSelector(
    (state) => state.settings.value?.interface.budgetTable.defaultTagEditingEnabled ?? false,
  );
  const settingsLoadStatus = useAppSelector((state) => state.settings.loadStatus);
  const initializedTagScope = useRef<BudgetFormScope | null>(null);
  const [initialSimpleMode] = useState(defaultSimpleMode);

  useEffect(() => {
    dispatch(setMode(initialSimpleMode));
  }, [dispatch, initialSimpleMode]);

  useEffect(() => {
    if (settingsLoadStatus === "idle" || settingsLoadStatus === "loading") return;
    if (initializedTagScope.current === scope) return;

    dispatch(setTagEditingEnabled({ scope, enabled: defaultTagEditingEnabled }));
    initializedTagScope.current = scope;
  }, [dispatch, scope, defaultTagEditingEnabled, settingsLoadStatus]);

  return (
    <div className={classes.container}>
      <QuotationInfo scope={scope} close={close} />
      <Items scope={scope} />
    </div>
  )
}

export default BudgetForm;