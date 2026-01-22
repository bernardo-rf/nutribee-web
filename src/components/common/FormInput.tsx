import React from 'react';

import { UseFormRegister, FieldError, FieldErrors, Path } from 'react-hook-form';
import RequiredFieldIndicator from './RequiredFieldIndicator';

interface FormInputProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError | FieldErrors<T>;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'time';
  options?: Array<{ value: string; label: string }>;
  className?: string;
  step?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  pattern?: string;
  'aria-label'?: string;
}

const FormInput = <T extends Record<string, unknown>>({
  label,
  name,
  register,
  error,
  required = false,
  type = 'text',
  options,
  className = '',
  step,
  placeholder,
  min,
  max,
  pattern,
  'aria-label': ariaLabel,
}: FormInputProps<T>) => {
  const inputClasses = `block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className}`;
  const errorClasses = 'mt-1 text-sm text-red-600';

  const getErrorMessage = (error: FieldError | FieldErrors<T> | undefined): string | undefined => {
    if (!error) return undefined;
    if (typeof error === 'object' && 'message' in error) {
      return error.message as string;
    }
    return 'This field is required';
  };

  const errorMessage = getErrorMessage(error);

  if (type === 'select' && options) {
    return (
      <div className="mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <RequiredFieldIndicator />}
        </label>
        <select
          id={name}
          {...register(name)}
          className={inputClasses}
          aria-label={ariaLabel || label}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage && <p className={errorClasses}>{errorMessage}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <RequiredFieldIndicator />}
        </label>
        <textarea
          id={name}
          {...register(name)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder={placeholder}
          aria-label={ariaLabel || label}
          rows={4}
        />
        {errorMessage && <p className={errorClasses}>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <RequiredFieldIndicator />}
      </label>
      <input
        type={type}
        id={name}
        {...register(name)}
        className={inputClasses}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        pattern={pattern}
        aria-label={ariaLabel || label}
      />
      {errorMessage && <p className={errorClasses}>{errorMessage}</p>}
    </div>
  );
};

export default FormInput; 