// redux
import { RootState } from "../store";

// utils
import { hasBudgetChanged } from "../../utils/budgetComparison";

const budgetEditHasChanges = (state: RootState) => {
    const budgetOriginal = state.budgetForm.originalBudget;

    if (budgetOriginal === null) return false;

    return hasBudgetChanged(budgetOriginal, {
        quotation: state.budgetForm.quotationInfo.budget_form_edit,
        items: state.budgetForm.listItems.budget_form_edit,
    });
}

export default budgetEditHasChanges;