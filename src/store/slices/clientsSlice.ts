import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { clientsService, Client, CreateClientDTO, UpdateClientDTO } from '@/services/clientsService';
import type { RootState } from '@/store';

interface ClientsState {
  items: Client[];
  selectedClient: Client | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClientsState = {
  items: [],
  selectedClient: null,
  status: 'idle',
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  return await clientsService.getAll();
});

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string) => {
    return await clientsService.getById(id);
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (client: CreateClientDTO) => {
    return await clientsService.create(client);
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }: { id: string; data: UpdateClientDTO }) => {
    return await clientsService.update(id, data);
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string) => {
    await clientsService.delete(id);
    return id;
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setSelectedClient: (state, action: PayloadAction<Client | null>) => {
      state.selectedClient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      // Fetch single client
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.selectedClient = action.payload;
      })
      // Create client
      .addCase(createClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update client
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedClient?.id === action.payload.id) {
          state.selectedClient = action.payload;
        }
      })
      // Delete client
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter((client) => client.id !== action.payload);
        if (state.selectedClient?.id === action.payload) {
          state.selectedClient = null;
        }
      });
  },
});

export const { setSelectedClient, clearError } = clientsSlice.actions;

// Selectors
export const selectAllClients = (state: RootState) => state.clients.items;
export const selectClientById = (state: RootState, clientId: string) =>
  state.clients.items.find((client) => client.id === clientId);
export const selectSelectedClient = (state: RootState) => state.clients.selectedClient;
export const selectClientsStatus = (state: RootState) => state.clients.status;
export const selectClientsError = (state: RootState) => state.clients.error;

export default clientsSlice.reducer; 