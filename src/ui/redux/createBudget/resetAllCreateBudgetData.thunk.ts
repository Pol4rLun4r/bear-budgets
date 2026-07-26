// redux types
import type { AppDispatch } from "../store";

// redux resets
import { resetItemData } from "../itemForm/itemFormSlice.ts";
import { resetStep } from "../itemForm/itemFormStepsSlice";
import { resetReferenceLink } from "../itemForm/ReferenceLinkFormSlice.ts";
import { resetList } from "../budgetForm/items/listItemsSlice.ts";
import { resetQuotation } from "../budgetForm/quotationInfoSlice.ts";

const resetAllCreateBudgetData = (dispatch: AppDispatch) => {
    dispatch(resetItemData('create_budget_add'));
    dispatch(resetItemData('create_budget_edit'));
    dispatch(resetStep('create_budget_add'));
    dispatch(resetStep('create_budget_edit'));
    dispatch(resetReferenceLink('create_budget_add'));
    dispatch(resetReferenceLink('create_budget_edit'));
    dispatch(resetList("budget_create"));
    dispatch(resetQuotation('budget_create'));
};

export default resetAllCreateBudgetData;