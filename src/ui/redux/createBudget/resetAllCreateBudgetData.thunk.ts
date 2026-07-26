// redux types
import type { AppDispatch } from "../store";

// redux resets
import { resetItemData } from "../itemForm/itemFormSlice.ts";
import { resetStep } from "../itemForm/itemFormStepsSlice";
import { resetReferenceLink } from "../itemForm/ReferenceLinkFormSlice.ts";
import { resetList } from "./items/listItemsSlice";
import { resetQuotation } from "./quotationSlice";

const resetAllCreateBudgetData = (dispatch: AppDispatch) => {
    dispatch(resetItemData('create_budget_add'));
    dispatch(resetItemData('create_budget_edit'));
    dispatch(resetStep('create_budget_add'));
    dispatch(resetStep('create_budget_edit'));
    dispatch(resetReferenceLink('create_budget_add'));
    dispatch(resetReferenceLink('create_budget_edit'));
    dispatch(resetList());
    dispatch(resetQuotation());
};

export default resetAllCreateBudgetData;