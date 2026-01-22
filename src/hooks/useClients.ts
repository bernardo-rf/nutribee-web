import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import type { CreateClientDTO, UpdateClientDTO } from '@/services/clientsService';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  selectAllClients,
  selectSelectedClient,
  selectClientsStatus,
  selectClientsError,
  setSelectedClient,
} from '@/store/slices/clientsSlice';

export const useClients = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector(selectAllClients);
  const selectedClient = useSelector(selectSelectedClient);
  const status = useSelector(selectClientsStatus);
  const error = useSelector(selectClientsError);

  const getClients = useCallback(() => {
    return dispatch(fetchClients());
  }, [dispatch]);

  const getClientById = useCallback(
    (id: string) => {
      return dispatch(fetchClientById(id));
    },
    [dispatch]
  );

  const addClient = useCallback(
    (client: CreateClientDTO) => {
      return dispatch(createClient(client));
    },
    [dispatch]
  );

  const editClient = useCallback(
    (id: string, data: UpdateClientDTO) => {
      return dispatch(updateClient({ id, data }));
    },
    [dispatch]
  );

  const removeClient = useCallback(
    (id: string) => {
      return dispatch(deleteClient(id));
    },
    [dispatch]
  );

  const selectClient = useCallback(
    (client: RootState['clients']['selectedClient']) => {
      dispatch(setSelectedClient(client));
    },
    [dispatch]
  );

  return {
    // State
    clients,
    selectedClient,
    status,
    error,
    isLoading: status === 'loading',
    // Actions
    getClients,
    getClientById,
    addClient,
    editClient,
    removeClient,
    selectClient,
  };
}; 