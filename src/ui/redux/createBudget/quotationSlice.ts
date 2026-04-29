// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Quotation = {
    id?: number;
    client_id?: number;
    created_at?: string;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
export type QuotationStatus = 0 | 1 | 2;

export type QuotationQuery = Omit<
    Quotation,
    "id" | "created_at" | "client_id"
> & {
    notes?: string | null;
    status?: QuotationStatus;
};

const initialState: QuotationQuery = {
    notes: undefined,
    status: 0
}

const quotationSlice = createSlice({
    name: "create-budget-quotation",
    initialState,
    reducers: {
        setNotes: (state, action: PayloadAction<string>) => {
            state.notes = action.payload;
        },
        setStatus: (state, action: PayloadAction<QuotationStatus>) => {
            state.status = action.payload;
        },
        setQuotation: (_state, action: PayloadAction<QuotationQuery>) => action.payload,
        resetQuotation: () => initialState,
    }
})

export const { setNotes, setStatus, setQuotation, resetQuotation } = quotationSlice.actions;

export default quotationSlice.reducer;