import { configureStore } from '@reduxjs/toolkit';

import clientsReducer from './slices/clientsSlice';

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['clients/fetchClients/pending', 'clients/fetchClients/fulfilled', 'clients/fetchClients/rejected'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 