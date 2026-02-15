import { configureStore } from "@reduxjs/toolkit";

// slices
import tabSlice from "./sideBar/tabSlice";
import collapsedSlice from "./sideBar/collapsedSlice";
import newClientSlice from "./createBudget/newClientSlice";
import stepsSlice from "./createBudget/stepsSlice";
import searchClientSlice from './createBudget/searchClient/searchClientSlice';

const store = configureStore({
    reducer: {
        tab: tabSlice,
        collapsed: collapsedSlice,
        newClient: newClientSlice,
        steps: stepsSlice,
        searchClient: searchClientSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;