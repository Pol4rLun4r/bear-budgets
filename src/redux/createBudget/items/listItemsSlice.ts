// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { itemDataType } from "./addItemSlice";

const initialState: itemDataType[] = [];

 type calcItemType = {
    finalUnitValue: number;
    totalWithAll: number;
}
 
const listItemsSlice = createSlice({
    name: "list-items",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<itemDataType>) => {
            state.push(action.payload);
        }
    }
});

export const { addItem } = listItemsSlice.actions;

export default listItemsSlice.reducer;