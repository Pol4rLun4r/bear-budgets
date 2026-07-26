import { combineReducers } from "@reduxjs/toolkit";

// slicers
import listItemsSlice from "./items/listItemsSlice";
import listItemsSwitchModeSlice from "./items/listItemsSwitchModeSlice";
import quotationInfoSlice from './quotationInfoSlice';

export type BudgetFormScope = "budget_create" | "budget_edit";

const BudgetFormReducer = combineReducers({
    quotationInfo: quotationInfoSlice,
    listItems: listItemsSlice,
    listItemsSwitchMode: listItemsSwitchModeSlice,
});

export default BudgetFormReducer;
