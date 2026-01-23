// Common UI types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Common operation states
export type OperationState<T = unknown> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Common form types
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};

// Common pagination types
export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Common date range types
export type DateRange = {
  startDate: string;
  endDate: string;
};

// Common filter types
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export type Filter = {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | null;
};

export type FilterGroup = {
  operator: 'and' | 'or';
  filters: (Filter | FilterGroup)[];
};
