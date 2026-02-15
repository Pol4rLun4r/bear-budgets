// redux
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSteps: false,
}

const stepsSlice = createSlice({
    name: "steps",
    initialState,
    reducers: {
        openSteps: (state) => {
            state.showSteps = true;
        },
        closeSteps: (state) => {
            state.showSteps = false;
        },
    }
});

export const { openSteps, closeSteps } = stepsSlice.actions;

export default stepsSlice.reducer;

