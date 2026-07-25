import { combineReducers } from "@reduxjs/toolkit";

// slicers
import listItemsSlice from "./items/listItemsSlice";
import listItemsSwitchModeSlice from "./items/listItemsSwitchModeSlice";
import quotationSlice from './quotationSlice';

const createBudgetReducer = combineReducers({
    quotation: quotationSlice,
    listItems: listItemsSlice,
    listItemsSwitchMode: listItemsSwitchModeSlice,
});

export default createBudgetReducer;
