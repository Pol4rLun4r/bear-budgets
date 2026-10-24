// redux
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// api
import { api } from "./api";

// reducers
import layoutReducer from "./layout/store/layout.slice";
import itemFormReducer from "@/features/budgets/itemForm/store/@rootReducer";

const rootReducer = combineReducers({
  layout: layoutReducer,
  itemForm: itemFormReducer,
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