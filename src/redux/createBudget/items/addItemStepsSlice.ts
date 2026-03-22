// redux
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 0,
}

const addItemStepsSlice = createSlice({
    name: 'add-item-steps',
    initialState,
    reducers: {
        incrementStep: (state) => {
            state.step = state.step + 1
        },
        decrementStep: (state) => {
            state.step = state.step - 1;
        },
        resetStep: () => initialState,
    }
});

export const { decrementStep, incrementStep, resetStep } = addItemStepsSlice.actions;

export default addItemStepsSlice.reducer;