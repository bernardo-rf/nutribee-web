import { configureStore } from '@reduxjs/toolkit';

import clientsReducer, { fetchClients } from './slices/clientsSlice';

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          fetchClients.pending.type,
          fetchClients.fulfilled.type,
          fetchClients.rejected.type,
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
