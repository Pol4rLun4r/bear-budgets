import { combineReducers } from "@reduxjs/toolkit";

// slicers
import listItemsSlice from "./items/listItemsSlice";
import listItemsSwitchModeSlice from "./items/listItemsSwitchModeSlice";
import quotationInfoSlice from './quotationInfoSlice';

export type BudgetFormScope = "budget_form_create" | "budget_form_edit";

const BudgetFormReducer = combineReducers({
    quotationInfo: quotationInfoSlice,
    listItems: listItemsSlice,
    listItemsSwitchMode: listItemsSwitchModeSlice,
});

export default BudgetFormReducer;
