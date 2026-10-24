// components
import Items from "./items/@Items";
import QuotationInfo from './quotationInfo/@QuotationInfo';

// redux
import { BudgetFormScope } from "../../redux/budgetForm/@rootReducer";

// styles
import classes from './budgetForm.module.css'

const BudgetForm = ({ scope, close }: { close?: () => void, scope: BudgetFormScope }) => {
  return (
    <div className={classes.container} data-info="budgetForm">
      <QuotationInfo scope={scope} close={close} />
      <Items scope={scope} />
    </div>
  )
}

export default BudgetForm;