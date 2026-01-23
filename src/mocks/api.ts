import type { ApiResponse } from '@/types/api';
import type { Client } from '@/types/domain';

import { mockClients } from './clients';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    await delay(500); // Simulate network delay

    if (url === '/clients') {
      return {
        data: mockClients as T,
        message: 'Clients retrieved successfully',
      };
    }

    if (url.startsWith('/clients/')) {
      const id = url.split('/')[2];
      const client = mockClients.find((c) => c.id === id);

      if (!client) {
        throw new Error('Client not found');
      }

      return {
        data: client as T,
        message: 'Client retrieved successfully',
      };
    }

    throw new Error('Endpoint not found');
  },

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    await delay(500);

    if (url === '/clients') {
      const newClient = {
        ...(data as Record<string, unknown>),
        id: String(mockClients.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        measurements: [],
        goals: [],
      } as unknown as Client;

      mockClients.push(newClient);

      return {
        data: newClient as T,
        message: 'Client created successfully',
      };
    }

    throw new Error('Endpoint not found');
  },

  async patch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    await delay(500);

    if (url.startsWith('/clients/')) {
      const id = url.split('/')[2];
      const index = mockClients.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error('Client not found');
      }

      const updatedClient = {
        ...mockClients[index],
        ...(data as Record<string, unknown>),
        updatedAt: new Date().toISOString(),
      } as unknown as Client;

      mockClients[index] = updatedClient;

      return {
        data: updatedClient as T,
        message: 'Client updated successfully',
      };
    }

    throw new Error('Endpoint not found');
  },

  async delete(url: string): Promise<void> {
    await delay(500);

    if (url.startsWith('/clients/')) {
      const id = url.split('/')[2];
      const index = mockClients.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error('Client not found');
      }

      mockClients.splice(index, 1);
      return;
    }

    throw new Error('Endpoint not found');
  },
};
