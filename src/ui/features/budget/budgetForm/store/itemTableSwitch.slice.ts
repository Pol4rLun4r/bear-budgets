// redux

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadSettings } from "@/features/settings/store/settings.slice";

type ItemFormSwitchModeState = {
    mode: boolean;
}

const initialState: ItemFormSwitchModeState = {
    mode: true,
}

const itemTableSwitchSlice = createSlice({
    name: "item-table-switch",
    initialState,
    reducers: {
        setModeOn: (state) => { state.mode = true },
        setModeOff: (state) => { state.mode = false },
        setMode: (state, action: PayloadAction<boolean>) => { state.mode = action.payload },
        resetMode: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            state.mode = action.payload.interface.budgetTable.defaultSimpleMode;
        });
    },
})

export const {
    resetMode,
    setModeOff,
    setModeOn,
    setMode,
} = itemTableSwitchSlice.actions;

export default itemTableSwitchSlice.reducer;