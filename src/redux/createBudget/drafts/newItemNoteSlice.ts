// redux 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type
import type { ItemReferenceNoteType } from "../items/addItemSlice";

const initialState: ItemReferenceNoteType = {
    content: '',
    type: 'text'
}

const newItemNoteSlice = createSlice({
    name: "newItemNote",
    initialState,
    reducers: {
        setNoteType: (state, action: PayloadAction<ItemReferenceNoteType>) => {
            state.type = action.payload.type;
        },
        setNoteContent: (state, action: PayloadAction<ItemReferenceNoteType>) => {
            state.content = action.payload.content;
        },
        resetNote: () => initialState
    }
});

export const {
    resetNote,
    setNoteContent,
    setNoteType
} = newItemNoteSlice.actions;

export default newItemNoteSlice.reducer;