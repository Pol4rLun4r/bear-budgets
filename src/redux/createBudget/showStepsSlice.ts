// redux
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSteps: false,
}

const showStepsSlice = createSlice({
    name: "showSteps",
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

export const { openSteps, closeSteps } = showStepsSlice.actions;

export default showStepsSlice.reducer;

