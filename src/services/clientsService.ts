import { get, post, patch, del } from '@/lib/axios';
import { mockApi } from '@/mocks/api';
import type { Client } from '@/types/domain';

export interface CreateClientDTO {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: Client['gender'];

  height: Client['height'];
  weight: Client['weight'];
  bodyFatPercentage?: number;

  activityLevel: Client['activityLevel'];
  exerciseRoutine?: Client['exerciseRoutine'];
  occupationType: Client['occupationType'];

  dietType: Client['dietType'];
  foodAllergies?: string[];
  favoriteFoods?: string[];
  foodsToAvoid?: string[];

  primaryGoal: Client['primaryGoal'];
  targetWeight?: Client['targetWeight'];
  healthConcerns?: string[];

  hydration: Client['hydration'];
  sleep: Client['sleep'];
  supplements?: string[];

  nutritionistId: string;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  status?: Client['status'];
}

const isDevelopment = import.meta.env.DEV;

export const clientsService = {
  async getAll(): Promise<Client[]> {
    if (isDevelopment) {
      const response = await mockApi.get<Client[]>('/clients');
      return response.data;
    }
    const response = await get<Client[]>('/clients');
    return response.data;
  },

  async getById(id: string): Promise<Client> {
    if (isDevelopment) {
      const response = await mockApi.get<Client>(`/clients/${id}`);
      return response.data;
    }
    const response = await get<Client>(`/clients/${id}`);
    return response.data;
  },

  async create(client: CreateClientDTO): Promise<Client> {
    if (isDevelopment) {
      const response = await mockApi.post<Client>('/clients', client);
      return response.data;
    }
    const response = await post<Client>('/clients', client);
    return response.data;
  },

  async update(id: string, client: UpdateClientDTO): Promise<Client> {
    if (isDevelopment) {
      const response = await mockApi.patch<Client>(`/clients/${id}`, client);
      return response.data;
    }
    const response = await patch<Client>(`/clients/${id}`, client);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (isDevelopment) {
      await mockApi.delete(`/clients/${id}`);
      return;
    }
    await del<void>(`/clients/${id}`);
  },

  async getMeasurements(id: string): Promise<Client['measurements']> {
    if (isDevelopment) {
      const client = await this.getById(id);
      return client.measurements;
    }
    const response = await get<Client['measurements']>(`/clients/${id}/measurements`);
    return response.data;
  },

  async getGoals(id: string): Promise<Client['goals']> {
    if (isDevelopment) {
      const client = await this.getById(id);
      return client.goals;
    }
    const response = await get<Client['goals']>(`/clients/${id}/goals`);
    return response.data;
  },
};
