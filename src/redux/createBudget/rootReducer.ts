import { combineReducers } from "@reduxjs/toolkit";
import newClientSlice from "./createClient/newClientSlice";
import showStepsSlice from "./showStepsSlice";
import searchClientSlice from "./searchClient/searchClientSlice";
import stepsSlice from "./stepsSlice";

const createBudgetReducer = combineReducers({
    newClient: newClientSlice,
    showSteps: showStepsSlice,
    searchClient: searchClientSlice,
    steps: stepsSlice,
});

export default createBudgetReducer;
