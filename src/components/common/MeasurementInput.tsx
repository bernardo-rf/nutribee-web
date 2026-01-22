import React from 'react';

import { UseFormRegister, FieldError, FieldErrors, Path } from 'react-hook-form';
import RequiredFieldIndicator from './RequiredFieldIndicator';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface MeasurementInputProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError | FieldErrors<T>;
  required?: boolean;
  units: Array<{ value: string; label: string }>;
  className?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: string;
  placeholder?: string;
  'aria-label'?: string;
}

const MeasurementInput = <T extends Record<string, unknown>>({
  label,
  name,
  register,
  error,
  required = false,
  units,
  className = '',
  description,
  'aria-label': ariaLabel,
  placeholder,
}: MeasurementInputProps<T>) => {
  const errorClasses = 'mt-1 text-sm text-red-600';

  const getErrorMessage = (error: FieldError | FieldErrors<T> | undefined): string | undefined => {
    if (!error) return undefined;
    if (typeof error === 'object' && 'message' in error) {
      return error.message as string;
    }
    return 'This field is required';
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="mb-1">
      <div className="flex items-center mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <RequiredFieldIndicator />}
        </label>
        {description && (
          <div className="client-form-info-tooltip">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="client-form-tooltip-content">
              {description}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          id={name}
          {...register(name)}
          className={`block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className}`}
          aria-label={ariaLabel || label}
          placeholder={placeholder}
        />
        <select
          id={`${name}Unit`}
          {...register(`${name}Unit` as Path<T>)}
          className="block w-24 h-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          aria-label={`${ariaLabel || label} unit`}
        >
          {units.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
      </div>
      {errorMessage && <p className={errorClasses}>{errorMessage}</p>}
    </div>
  );
};

export default MeasurementInput; 