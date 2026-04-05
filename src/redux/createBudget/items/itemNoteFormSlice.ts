// redux 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type
import type { ItemFormScope, ItemNoteType } from "./itemFormSlice";

export interface ItemNoteFormSliceState {
    add: ItemNoteType;
    edit: ItemNoteType;
};

const createEmptyNoteData = (): ItemNoteType => {
    return {
        content: '',
        type: 'text'
    };
};

const initialState: ItemNoteFormSliceState = {
    add: createEmptyNoteData(),
    edit: createEmptyNoteData(),
};

const draft = (state: ItemNoteFormSliceState, scope: ItemFormScope): ItemNoteType => {
    return state[scope];
};

const itemNoteFormSlice = createSlice({
    name: "item-note-form",
    initialState,
    reducers: {
        setNoteType: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; type: "text" | "link" }>) => {
            draft(state, action.payload.scope).type = action.payload.type;
        },
        setNoteContent: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; content: string }>) => {
            draft(state, action.payload.scope).content = action.payload.content;
        },
        resetNote: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyNoteData();
            state[action.payload] = empty;
        }
    }
});

export const {
    resetNote,
    setNoteContent,
    setNoteType
} = itemNoteFormSlice.actions;

export default itemNoteFormSlice.reducer;