// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SearchClientDataType = {
    value: string;
    type: 'document' | 'name'
}

const initialState: SearchClientDataType = {
    value: '',
    type: "document"
};

const searchClientSlice = createSlice({
    name: 'searchClient',
    initialState,
    reducers: {
        setSearchClient: (state, action: PayloadAction<SearchClientDataType>) => {
            state.value = action.payload.value;
            state.type = action.payload.type; 
        },
        resetSearchClient: () => initialState,
    }
});

export const { setSearchClient, resetSearchClient } = searchClientSlice.actions;

export default searchClientSlice.reducer;