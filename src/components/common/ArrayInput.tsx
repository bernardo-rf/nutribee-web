import React, { useState } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { UseFormSetValue, FieldError, FieldErrors, Path, PathValue } from 'react-hook-form';

interface ArrayInputProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  error?: FieldError | FieldErrors<T>;
  placeholder?: string;
  className?: string;
  maxItems?: number;
}

interface ListItemProps {
  item: string;
  onRemove: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, onRemove }) => (
  <li className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5">
    <span className="text-sm text-gray-700">{item}</span>
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-400 hover:text-gray-500"
      aria-label={`Remove ${item}`}
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
  </li>
);

const ArrayInput = <T extends Record<string, unknown>>({
  label,
  name,
  setValue,
  error,
  placeholder,
  className = '',
  maxItems,
}: ArrayInputProps<T>) => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const errorMessage = error?.message as string | undefined;
  const inputId = `input-${String(name)}`;
  const listId = `list-${String(name)}`;
  const errorId = `error-${String(name)}`;

  const handleAddItem = () => {
    if (newItem.trim() && (!maxItems || items.length < maxItems)) {
      if (!items.includes(newItem.trim())) {
        const updatedItems = [...items, newItem.trim()];
        setItems(updatedItems);
        setValue(name, updatedItems as PathValue<T, Path<T>>);
        setNewItem('');
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setValue(name, updatedItems as PathValue<T, Path<T>>);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-controls={listId}
          className="block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
        />
        <button
          type="button"
          onClick={handleAddItem}
          disabled={!newItem.trim() || (maxItems !== undefined && items.length >= maxItems)}
          className="inline-flex items-center h-9 rounded-md border border-transparent bg-primary-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Add ${newItem.trim() ? newItem : 'item'}`}
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <ul id={listId} className="space-y-1" aria-label={`${label} items`}>
          {items.map((item, index) => (
            <ListItem
              key={`${item}-${index}`}
              item={item}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}
        </ul>
      )}
      {errorMessage && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      {maxItems !== undefined && (
        <p className="text-xs text-gray-500">
          {items.length} of {maxItems} items
        </p>
      )}
    </div>
  );
};

export default ArrayInput;
