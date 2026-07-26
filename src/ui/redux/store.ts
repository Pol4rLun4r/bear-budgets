import { combineReducers, configureStore } from "@reduxjs/toolkit";

// domain reducers
import sidebarReducer from "./sideBar/rootReducer";
import budgetFormReducer from "./budgetForm/@rootReducer.ts";
import itemsReducer from "./items/@rootReducer.ts"
import itemFormReducer from "./itemForm/@rootReducer.ts";

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    budgetForm: budgetFormReducer,
    itemForm: itemFormReducer,
    items: itemsReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;