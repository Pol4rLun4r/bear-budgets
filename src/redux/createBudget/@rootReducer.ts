import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from "./items/itemFormSlice";
import itemNoteFormSlice from "./items/itemNoteFormSlice";
import itemFormSwitchModeSlice from "./items/itemFormSwitchModeSlice";
import clientSlice from './clientSlice';
import itemFormStepsSlice from './items/itemFormStepsSlice';
import listItemsSlice from "./items/listItemsSlice";
import listItemsSwitchModeSlice from "./items/listItemsSwitchModeSlice";

const createBudgetReducer = combineReducers({
    client: clientSlice,
    itemForm: itemFormSlice,
    itemNoteForm: itemNoteFormSlice,
    itemFormSteps: itemFormStepsSlice,
    itemFormSwitchMode: itemFormSwitchModeSlice,
    listItems: listItemsSlice,
    listItemsSwitchMode: listItemsSwitchModeSlice,
});

export default createBudgetReducer;
