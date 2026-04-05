import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from "./items/itemFormSlice";
import itemNoteFormSlice from "./items/itemNoteFormSlice";
import clientSlice from './clientSlice';
import itemFormStepsSlice from './items/itemFormStepsSlice';
import listItemsSlice from "./items/listItemsSlice";

const createBudgetReducer = combineReducers({
    client: clientSlice,
    itemForm: itemFormSlice,
    itemNoteForm: itemNoteFormSlice,
    itemFormSteps: itemFormStepsSlice,
    listItems: listItemsSlice
});

export default createBudgetReducer;
