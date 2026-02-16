// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import type { ClientQuery } from '../../../../types/client'

const initialState: ClientQuery = {
    name: '',
    document: '',
    notes: '',
    type_client: "nacional"
}

const newClientSlice = createSlice({
    name: "newClient",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setDocument: (state, action: PayloadAction<string>) => {
            state.document = action.payload;
        },
        setNewClient: (state, action: PayloadAction<ClientQuery>) => {
            state.name = action.payload.name;
            state.document = action.payload.document;
            state.notes = action.payload.notes;
            state.type_client = action.payload.type_client;
        },
        resetNewClient: () => initialState,
    }
})

export const { setDocument, setName, setNewClient, resetNewClient } = newClientSlice.actions;

export default newClientSlice.reducer;