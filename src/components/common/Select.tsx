import { UseFormRegister, FieldError, FieldErrors, Path } from 'react-hook-form';

import RequiredFieldIndicator from './RequiredFieldIndicator';

interface SelectProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError | FieldErrors<T>;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  className?: string;
  placeholder?: string;
  'aria-label'?: string;
}

const Select = <T extends Record<string, unknown>>({
  label,
  name,
  register,
  error,
  required = false,
  options,
  className = '',
  placeholder,
  'aria-label': ariaLabel,
}: SelectProps<T>) => {
  const selectClasses = `block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className}`;
  const errorClasses = 'mt-1 text-sm text-red-600';

  const getErrorMessage = (error: FieldError | FieldErrors<T> | undefined): string | undefined => {
    if (!error) return undefined;
    if (typeof error === 'object' && 'message' in error) {
      return error.message as string;
    }
    return 'This field is required';
  };

  const errorMessage = getErrorMessage(error);
  const errorId = `${name}-error`;

  return (
    <div className="mb-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <RequiredFieldIndicator />}
      </label>
      <select
        id={name}
        {...register(name)}
        className={selectClasses}
        aria-label={ariaLabel ?? label}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p id={errorId} className={errorClasses}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Select;
