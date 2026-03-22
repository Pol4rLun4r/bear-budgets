import { combineReducers } from "@reduxjs/toolkit";
import showStepsSlice from "./showStepsSlice";
import searchClientSlice from "./searchClient/searchClientSlice";
import stepsSlice from "./stepsSlice";
import quotationBasicDataSlice from './drafts/quotationBasicDataSlice';
import addItemSlice from "./items/addItemSlice";
import newItemNoteSlice from "./newItemNoteSlice";
import clientSlice from './clientSlice';
import addItemStepsSlice from './items/addItemStepsSlice';

const createBudgetReducer = combineReducers({
    client: clientSlice,
    showSteps: showStepsSlice,
    searchClient: searchClientSlice,
    steps: stepsSlice,
    quotationBasicData: quotationBasicDataSlice,
    addItem: addItemSlice,
    newItemNote: newItemNoteSlice,
    addItemSteps: addItemStepsSlice
});

export default createBudgetReducer;
