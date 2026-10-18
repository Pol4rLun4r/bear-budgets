import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
    isSidebarCollapsed: boolean;
    activePage: number;
}

const initialState: LayoutState = {
    isSidebarCollapsed: false,
    activePage: 0
};

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setActivePage: (state, action: PayloadAction<number>) => {
            state.activePage = action.payload;
        }
    },
});

export const { toggleSidebar, setActivePage } = layoutSlice.actions;
export default layoutSlice.reducer;
