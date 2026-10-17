import { combineReducers } from "@reduxjs/toolkit";

// slicers
import getAllItemReferencesBySearchSlice from "./getAllItemReferencesBySearchSlice.ts"
import menuSlice from "./menuSlice.ts"

const itemsReducer = combineReducers({
    search: getAllItemReferencesBySearchSlice,
    menu: menuSlice
})

export default itemsReducer;