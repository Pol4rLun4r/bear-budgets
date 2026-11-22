// redux

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ItemFormSwitchState = {
    item_reference: { mode: boolean };
    item_values: { mode: boolean };
}

const initialState: ItemFormSwitchState = {
    item_reference: { mode: false },
    item_values: { mode: false },
}

export type SwitchProps = "item_reference" | "item_values"

const itemFormSwitchSlice = createSlice({
    name: "item-form-switch",
    initialState,
    reducers: {
        setSwitchOnItemReference: (state) => { state.item_reference.mode = true },
        setSwitchOffItemReference: (state) => { state.item_reference.mode = false },
        setSwitchOnItemValues: (state) => { state.item_values.mode = true },
        setSwitchOffItemValues: (state) => { state.item_values.mode = false },
        setSwitchModes: (
            state,
            action: PayloadAction<{ item_reference: boolean; item_values: boolean }>,
        ) => {
            state.item_reference.mode = action.payload.item_reference;
            state.item_values.mode = action.payload.item_values;
        },
        resetSwitch: () => initialState
    },
})

export const {
    resetSwitch,
    setSwitchOffItemReference,
    setSwitchOnItemReference,
    setSwitchOffItemValues,
    setSwitchOnItemValues,
    setSwitchModes,
} = itemFormSwitchSlice.actions;

export default itemFormSwitchSlice.reducer;