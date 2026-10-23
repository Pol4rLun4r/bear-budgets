// redux
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// reducers
import layoutReducer from "./layout/store/layout.slice";
import itemFormReducer from "@/features/budgets/itemForm/store/@rootReducer";

const rootReducer = combineReducers({
    layout: layoutReducer,
    itemForm: itemFormReducer
});


const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;