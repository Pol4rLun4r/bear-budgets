import { useEffect, useState } from "react";

// components
import Items from "./components/itemTable/@ItemTable";
import QuotationInfo from './components/quotationInfo/@QuotationInfo';

// redux
import { BudgetFormScope } from "./store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setMode } from "./store/itemTableSwitch.slice";

// styles
import classes from './budgetForm.module.css'

const BudgetForm = ({ scope, close }: { close?: () => void, scope: BudgetFormScope }) => {
  const dispatch = useAppDispatch();
  const defaultSimpleMode = useAppSelector(
    (state) => state.settings.value?.interface.budgetTable.defaultSimpleMode ?? true,
  );
  const [initialSimpleMode] = useState(defaultSimpleMode);

  useEffect(() => {
    dispatch(setMode(initialSimpleMode));
  }, [dispatch, initialSimpleMode]);

  return (
    <div className={classes.container}>
      <QuotationInfo scope={scope} close={close} />
      <Items scope={scope} />
    </div>
  )
}

export default BudgetForm;