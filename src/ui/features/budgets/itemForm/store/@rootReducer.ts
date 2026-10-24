import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from './itemForm.slice';
import itemFormSwitchSlice from "./itemFormSwitch.slice";
import itemFormStepsSlice from "./itemFormSteps.slice"

const itemFormReducer = combineReducers({
    form: itemFormSlice,
    switch: itemFormSwitchSlice,
    steps: itemFormStepsSlice
})

export default itemFormReducer;