import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from './itemForm.slice';

const itemFormReducer = combineReducers({
    form: itemFormSlice,
})

export default itemFormReducer;