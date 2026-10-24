import { combineReducers } from "@reduxjs/toolkit";

// slicers
import searchSlice from "./search.slice.ts"
import menuSlice from "./menu.slice.ts"

const itemsReducer = combineReducers({
    search: searchSlice,
    menu: menuSlice
})

export default itemsReducer;