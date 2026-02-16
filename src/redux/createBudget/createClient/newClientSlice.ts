// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import type { ClientQuery } from '../../../../types/client'

export interface newClientClientDataType extends ClientQuery {
    id?: number;
    created_at?: string;
    updated_at?: string;
}

const initialState: newClientClientDataType = {
    id: undefined,
    name: '',
    document: '',
    notes: '',
    type_client: "nacional",
    created_at: '',
    updated_at: '',
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
        setNewClient: (state, action: PayloadAction<newClientClientDataType>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.document = action.payload.document;
            state.notes = action.payload.notes;
            state.type_client = action.payload.type_client;
            state.created_at = action.payload.created_at;
            state.updated_at = action.payload.updated_at;
        },
        resetNewClient: () => initialState,
    }
})

export const { setDocument, setName, setNewClient, resetNewClient } = newClientSlice.actions;

export default newClientSlice.reducer;