import { combineReducers, configureStore } from "@reduxjs/toolkit";

// domain reducers
import sidebarReducer from "./sideBar/rootReducer";
import createBudgetReducer from "./createBudget/@rootReducer";
import itemsReducer from "./items/@rootReducer.ts"
import ItemFormReducer from "./itemForm/@rootReducer.ts";

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    createBudget: createBudgetReducer,
    itemForm: ItemFormReducer,
    items: itemsReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;