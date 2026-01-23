import { Client, Measurement, NutritionGoal } from './domain';

// API Response types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export type ApiError = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
};

// API Request types
export type CreateClientRequest = Omit<
  Client,
  'id' | 'createdAt' | 'updatedAt' | 'measurements' | 'goals'
>;
export type UpdateClientRequest = Partial<CreateClientRequest>;

export type CreateMeasurementRequest = Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMeasurementRequest = Partial<CreateMeasurementRequest>;

export type CreateGoalRequest = Omit<NutritionGoal, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGoalRequest = Partial<CreateGoalRequest>;

// API Endpoints
export type ApiEndpoints = {
  clients: {
    getAll: () => Promise<ApiResponse<Client[]>>;
    getById: (id: string) => Promise<ApiResponse<Client>>;
    create: (data: CreateClientRequest) => Promise<ApiResponse<Client>>;
    update: (id: string, data: UpdateClientRequest) => Promise<ApiResponse<Client>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };
  measurements: {
    getAll: (clientId: string) => Promise<ApiResponse<Measurement[]>>;
    create: (data: CreateMeasurementRequest) => Promise<ApiResponse<Measurement>>;
    update: (id: string, data: UpdateMeasurementRequest) => Promise<ApiResponse<Measurement>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };
  goals: {
    getAll: (clientId: string) => Promise<ApiResponse<NutritionGoal[]>>;
    create: (data: CreateGoalRequest) => Promise<ApiResponse<NutritionGoal>>;
    update: (id: string, data: UpdateGoalRequest) => Promise<ApiResponse<NutritionGoal>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };
};
