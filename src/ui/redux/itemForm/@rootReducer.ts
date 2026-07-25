import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from "./itemFormSlice";
import itemFormStepsSlice from './itemFormStepsSlice';
import itemFormSwitchModeSlice from "./itemFormSwitchModeSlice";
import ReferenceLinkFormSlice from "./ReferenceLinkFormSlice";

const ItemFormReducer = combineReducers({
    form: itemFormSlice,
    steps: itemFormStepsSlice,
    referenceLinkForm: ReferenceLinkFormSlice,
    switchMode: itemFormSwitchModeSlice,
});

export default ItemFormReducer;