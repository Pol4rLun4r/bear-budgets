// redux
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// api
import { api } from "./api";

// reducers
import layoutReducer from "./layout/store/layout.slice";
import itemFormReducer from "@/features/budget/itemForm/store/@rootReducer";
import BudgetFormReducer from "@/features/budget/budgetForm/store/@rootReducer";

const rootReducer = combineReducers({
  layout: layoutReducer,
  itemForm: itemFormReducer,
  budgetForm: BudgetFormReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;