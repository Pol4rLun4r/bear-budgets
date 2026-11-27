// redux
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// api
import { api } from "./api";

// reducers
import layoutReducer from "./layout/store/layout.slice";
import itemFormReducer from "@/features/budget/itemForm/store/@rootReducer";
import budgetFormReducer from "@/features/budget/budgetForm/store/@rootReducer";
import budgetsReducer from "@/features/budget/budgets/store/budgets.slice";
import itemsReducer from "@/features/items/store/@rootReducer";
import settingsReducer from "@/features/settings/store/settings.slice";

const rootReducer = combineReducers({
  layout: layoutReducer,
  itemForm: itemFormReducer,
  budgetForm: budgetFormReducer,
  budgets: budgetsReducer,
  items: itemsReducer,
  settings: settingsReducer,
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