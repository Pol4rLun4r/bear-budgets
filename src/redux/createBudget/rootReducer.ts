import { combineReducers } from "@reduxjs/toolkit";
import newClientSlice from "./createClient/newClientSlice";
import showStepsSlice from "./showStepsSlice";
import searchClientSlice from "./searchClient/searchClientSlice";
import stepsSlice from "./stepsSlice";
import quotationBasicDataSlice from './drafts/quotationBasicDataSlice';
import addItemSlice from "./items/addItemSlice";

const createBudgetReducer = combineReducers({
    newClient: newClientSlice,
    showSteps: showStepsSlice,
    searchClient: searchClientSlice,
    steps: stepsSlice,
    quotationBasicData: quotationBasicDataSlice,
    addItem: addItemSlice,
});

export default createBudgetReducer;
