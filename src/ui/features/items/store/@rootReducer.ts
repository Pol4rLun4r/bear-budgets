import { combineReducers } from "@reduxjs/toolkit";

// slicers
import searchSlice from "./search.slice.ts";
import menuSlice from "./menu.slice.ts";
import itemDetailsSlice from "./itemDetails.slice.ts";
import itemValuesSlice from "./ItemValues.slice.ts";

const itemsReducer = combineReducers({
    search: searchSlice,
    menu: menuSlice,
    itemDetails: itemDetailsSlice,
    itemValues: itemValuesSlice,
})

export default itemsReducer;