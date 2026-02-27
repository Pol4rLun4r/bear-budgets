// redux 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface quotationBasicDataSliceDataType {
    quotation_version_id: number | null | undefined;
    client_id: number | null | undefined;
    notes: string | null | undefined;
    status: string | null | undefined;
    client_name: string | null | undefined;
    client_document: string | null | undefined;
}

const initialState: quotationBasicDataSliceDataType = {
    quotation_version_id: null,
    client_id: null,
    notes: '',
    status: '0',
    client_name: '',
    client_document: '',
}

const quotationBasicDataSlice = createSlice({
    name: 'quotationBasicData',
    initialState,
    reducers: {
        setBasicData: (state, action: PayloadAction<quotationBasicDataSliceDataType>) => {
            state.quotation_version_id = action.payload.quotation_version_id;
            state.client_id = action.payload.client_id;
            state.notes = action.payload.notes;
            state.status = action.payload.status;
            state.client_name = action.payload.client_name;
            state.client_document = action.payload.client_document;
        },
        resetBasicData: () => initialState,
    }
});

export const { resetBasicData, setBasicData } = quotationBasicDataSlice.actions

export default quotationBasicDataSlice.reducer;