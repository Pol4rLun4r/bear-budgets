// components
import Items from "../../components/budgetForm/items/@Items";
import QuotationInfo from '../../components/budgetForm/quotationInfo/@QuotationInfo';

// redux
import { BudgetFormScope } from "../../redux/budgetForm/@rootReducer";

// styles
import classes from './budgetForm.module.css'

const BudgetForm = ({ scope }: { scope: BudgetFormScope }) => {
  return (
    <div className={classes.container}>
      <QuotationInfo scope={scope} />
      <Items scope={scope} />
    </div>
  )
}

export default BudgetForm;