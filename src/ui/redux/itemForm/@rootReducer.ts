import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from "./itemFormSlice";
import itemFormStepsSlice from './itemFormStepsSlice';
import itemFormSwitchSlice from "./itemFormSwitchModeSlice";
import ReferenceLinkFormSlice from "./ReferenceLinkFormSlice";

const ItemFormReducer = combineReducers({
    form: itemFormSlice,
    steps: itemFormStepsSlice,
    referenceLinkForm: ReferenceLinkFormSlice,
    switch: itemFormSwitchSlice,
});

export default ItemFormReducer;