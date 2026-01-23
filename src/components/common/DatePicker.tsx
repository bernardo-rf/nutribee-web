import React, { useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

import './../../styles/DatePicker.css';

interface DatePickerProps {
  label?: string;
  value: string | null;
  onChange: (date: string) => void;
  error?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required,
}) => {
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearRange, setYearRange] = useState({ start: 1900, end: new Date().getFullYear() + 10 });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevYear = () => {
    setYearRange((prev) => ({ ...prev, start: prev.start - 10, end: prev.end - 10 }));
  };

  const handleNextYear = () => {
    setYearRange((prev) => ({ ...prev, start: prev.start + 10, end: prev.end + 10 }));
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth()));
    setShowYearPicker(false);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(format(newDate, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.start + i,
  );

  return (
    <div className="date-picker-container">
      <label htmlFor="date-picker-input" className="date-picker-label">
        {label}
        {required && <span className="date-picker-required">*</span>}
      </label>
      <input
        id="date-picker-input"
        type="text"
        value={formatDate(value ? new Date(value) : null)}
        onClick={() => setIsOpen(true)}
        readOnly
        placeholder="Select date"
        className="date-picker-input h-9"
      />
      {error && <p className="date-picker-error">{error}</p>}

      {isOpen && (
        <div className="date-picker-modal">
          <div className="date-picker-overlay" onClick={() => setIsOpen(false)} />
          <div className="date-picker-content">
            {showYearPicker ? (
              <>
                <div className="date-picker-header">
                  <button type="button" onClick={handlePrevYear} className="date-picker-nav-button">
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <span className="date-picker-month">
                    {yearRange.start} - {yearRange.end}
                  </span>
                  <button type="button" onClick={handleNextYear} className="date-picker-nav-button">
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`p-2 text-sm rounded-md ${
                        year === currentDate.getFullYear()
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="date-picker-header">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="date-picker-nav-button"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="date-picker-month">{monthNames[currentDate.getMonth()]}</span>
                    <button
                      type="button"
                      onClick={() => setShowYearPicker(true)}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {currentDate.getFullYear()}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="date-picker-nav-button"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="date-picker-grid">
                  {weekDays.map((day) => (
                    <div key={day} className="date-picker-weekday">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = value
                      ? new Date(value).toDateString() === date.toDateString()
                      : false;

                    let dayClassName = 'date-picker-day';
                    if (isSelected) {
                      dayClassName += ' date-picker-day-selected';
                    } else if (isToday) {
                      dayClassName += ' date-picker-day-today';
                    } else {
                      dayClassName += ' hover:bg-gray-100';
                    }

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={dayClassName}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
