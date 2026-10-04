// redux types
import type { AppDispatch } from "../store.ts";

// redux resets
import { resetItemData } from "../itemForm/itemFormSlice.ts";
import { resetStep } from "../itemForm/itemFormStepsSlice.ts";
import { resetReferenceLink } from "../itemForm/ReferenceLinkFormSlice.ts";
import { resetList } from "./items/listItemsSlice.ts";
import { resetQuotation } from "./quotationInfoSlice.ts";

// type
import { BudgetFormScope } from "./@rootReducer.ts";

const resetAllBudgetData = (dispatch: AppDispatch, scope: BudgetFormScope) => {

    console.log(scope);

    dispatch(resetItemData('item_form_add'));
    dispatch(resetItemData('item_form_edit'));
    dispatch(resetStep('item_form_add'));
    dispatch(resetStep('item_form_edit'));
    dispatch(resetReferenceLink('item_form_add'));
    dispatch(resetReferenceLink('item_form_edit'));
    dispatch(resetList('budget_form_create'));
    dispatch(resetQuotation('budget_form_create'));
};

export default resetAllBudgetData;