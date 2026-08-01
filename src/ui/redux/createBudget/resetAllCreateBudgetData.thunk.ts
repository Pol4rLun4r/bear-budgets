// redux types
import type { AppDispatch } from "../store";

// redux resets
import { resetItemData } from "../itemForm/itemFormSlice.ts";
import { resetStep } from "../itemForm/itemFormStepsSlice";
import { resetReferenceLink } from "../itemForm/ReferenceLinkFormSlice.ts";
import { resetList } from "../budgetForm/items/listItemsSlice.ts";
import { resetQuotation } from "../budgetForm/quotationInfoSlice.ts";

const resetAllCreateBudgetData = (dispatch: AppDispatch) => {
    dispatch(resetItemData('item_form_add'));
    dispatch(resetItemData('item_form_edit'));
    dispatch(resetStep('item_form_add'));
    dispatch(resetStep('item_form_edit'));
    dispatch(resetReferenceLink('item_form_add'));
    dispatch(resetReferenceLink('item_form_edit'));
    dispatch(resetList('budget_form_create'));
    dispatch(resetQuotation('budget_form_create'));
};

export default resetAllCreateBudgetData;