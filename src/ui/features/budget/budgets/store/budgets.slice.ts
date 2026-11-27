import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BudgetsState {
    search: string;
    statusFilter: string | null;
}

const initialState: BudgetsState = {
    search: "",
    statusFilter: null,
};

const budgetsSlice = createSlice({
    name: "budgets",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setStatusFilter: (state, action: PayloadAction<string | null>) => {
            state.statusFilter = action.payload;
        },
    },
});

export const { setSearch, setStatusFilter } = budgetsSlice.actions;

export default budgetsSlice.reducer;
