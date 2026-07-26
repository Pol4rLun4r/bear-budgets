// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BudgetFormScope } from "./@rootReducer";

export interface QuotationInfoSliceState {
    budget_create: Quotation;
    budget_edit: Quotation;
}

export const createEmptyQuotationData = (): Quotation => {
    return {
        notes: undefined,
        status: 0,
        amount: 0,
        total_value: 0
    }
};

const initialState: QuotationInfoSliceState = {
    budget_create: createEmptyQuotationData(),
    budget_edit: createEmptyQuotationData()
}

const draft = (state: QuotationInfoSliceState, scope: BudgetFormScope): Quotation => {
    return state[scope];
};

const quotationInfoSlice = createSlice({
    name: "budget-quotation-info",
    initialState,
    reducers: {
        setNotes: (
            state: QuotationInfoSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: Quotation['notes'] }>
        ) => {
            const quotation = draft(state, action.payload.scope);

            quotation.notes = action.payload.data;
        },
        setStatus: (
            state: QuotationInfoSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: QuotationStatus }>
        ) => {
            const quotation = draft(state, action.payload.scope);

            quotation.status = action.payload.data;
        },
        setAmount: (
            state: QuotationInfoSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: Quotation['amount'] }>
        ) => {
            const quotation = draft(state, action.payload.scope);

            quotation.amount = action.payload.data;
        },
        setTotalValue: (
            state: QuotationInfoSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: Quotation['total_value'] }>
        ) => {
            const quotation = draft(state, action.payload.scope);

            quotation.total_value = action.payload.data;
        },
        setQuotation: (
            state: QuotationInfoSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: Quotation }>
        ) => {
            state[action.payload.scope] = action.payload.data
        },
        resetQuotation: (
            state: QuotationInfoSliceState,
            action: PayloadAction<BudgetFormScope>
        ) => {
            state[action.payload] = createEmptyQuotationData();
        }
    }
})

export const { setNotes, setStatus, setQuotation, resetQuotation, setAmount, setTotalValue } = quotationInfoSlice.actions;

export default quotationInfoSlice.reducer;