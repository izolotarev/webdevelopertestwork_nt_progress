import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from './services/api';
import { redirect } from './store/middlewares/redirect';
import { rootReducer } from './store/reducers/root-reducer';

const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }).concat(redirect),
});

export type AppDispatch = typeof store.dispatch
export type StoreType = typeof store
