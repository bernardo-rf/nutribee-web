import { ReactElement } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

import type { RootState } from '@/store';
import clientsReducer from '@/store/slices/clientsSlice';

interface PreloadedState {
  clients?: Partial<RootState['clients']>;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        clients: clientsReducer,
      },
      preloadedState: {
        clients: {
          items: [],
          selectedClient: null,
          status: 'idle' as const,
          error: null,
          ...preloadedState.clients,
        },
      },
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { readonly children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
