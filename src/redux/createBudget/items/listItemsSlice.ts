// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { itemDataType } from "./addItemSlice";

const initialState: itemDataType[] = [];
 
const listItemsSlice = createSlice({
    name: "list-items",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<itemDataType>) => {
            state.push(action.payload);
        },
        resetList: () => initialState
    }
});

export const { addItem, resetList } = listItemsSlice.actions;

export default listItemsSlice.reducer;