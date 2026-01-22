import { OperationState } from './common';
import { Client, Measurement, NutritionGoal } from './domain';

// Store State Types
export interface RootState {
  clients: ClientsState;
  measurements: MeasurementsState;
  goals: GoalsState;
  ui: UiState;
}

export interface ClientsState {
  items: Client[];
  selectedClient: Client | null;
  operation: OperationState<Client>;
}

export interface MeasurementsState {
  items: Record<string, Measurement[]>; // clientId -> measurements
  operation: OperationState<Measurement>;
}

export interface GoalsState {
  items: Record<string, NutritionGoal[]>; // clientId -> goals
  operation: OperationState<NutritionGoal>;
}

export interface UiState {
  sidebar: {
    isOpen: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Action Types
export type ActionType = 
  | 'clients/fetchAll'
  | 'clients/fetchById'
  | 'clients/create'
  | 'clients/update'
  | 'clients/delete'
  | 'measurements/fetchAll'
  | 'measurements/create'
  | 'measurements/update'
  | 'measurements/delete'
  | 'goals/fetchAll'
  | 'goals/create'
  | 'goals/update'
  | 'goals/delete'
  | 'ui/toggleSidebar'
  | 'ui/openModal'
  | 'ui/closeModal'
  | 'ui/addNotification'
  | 'ui/removeNotification';

// Thunk Action Types
export type ThunkAction = {
  type: ActionType;
  payload?: unknown;
  meta?: {
    requestId?: string;
    timestamp?: number;
  };
}; 