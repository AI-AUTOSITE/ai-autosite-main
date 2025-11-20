'use client';

import { useState, useMemo } from 'react';

interface CalendarPickerProps {
  onDateSelect: (date: Date) => void;
  onCancel: () => void;
}

export default function CalendarPicker({ onDateSelect, onCancel }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get today in NYC timezone (America/New_York)
  const today = useMemo(() => {
    const now = new Date();
    const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    nycTime.setHours(0, 0, 0, 0);
    return nycTime;
  }, []);

  // Date 30 days from today
  const maxDate = useMemo(() => {
    const max = new Date(today);
    max.setDate(max.getDate() + 30);
    return max;
  }, [today]);

  // Generate calendar date data
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of week for first day (0=Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calendar date array
    const days: (Date | null)[] = [];
    
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dates for current month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push(new Date(year, month, date));
    }
    
    return days;
  }, [currentMonth]);

  // Check if date is selectable
  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    return dateOnly >= today && dateOnly <= maxDate;
  };

  // Go to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    
    // Cannot go before current month
    if (newMonth.getMonth() < today.getMonth() && newMonth.getFullYear() <= today.getFullYear()) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  // Go to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    
    // Cannot go beyond maxDate month (dynamic 30-day limit)
    const maxMonth = maxDate.getMonth();
    const maxYear = maxDate.getFullYear();
    const newMonthValue = newMonth.getMonth();
    const newYear = newMonth.getFullYear();
    
    if (newYear > maxYear || (newYear === maxYear && newMonthValue > maxMonth)) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  // Check if next month button is disabled (dynamic)
  const isNextMonthDisabled = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const maxMonth = maxDate.getMonth();
    const maxYear = maxDate.getFullYear();
    const nextMonthValue = nextMonth.getMonth();
    const nextYear = nextMonth.getFullYear();
    
    return nextYear > maxYear || (nextYear === maxYear && nextMonthValue > maxMonth);
  };

  // Click date
  const handleDateClick = (date: Date | null) => {
    if (!date || !isDateSelectable(date)) return;
    onDateSelect(date);
  };

  // Check if today
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly.getTime() === today.getTime();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
          aria-label="Go to previous month"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-lg font-bold text-gray-800">
          {currentMonth.getFullYear()}/ {currentMonth.getMonth() + 1}, 
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          disabled={isNextMonthDisabled()}
          aria-label="Go to next month"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Display up to 6 weeks */}
      <div className="grid grid-cols-7 gap-1 min-h-[240px]">
        {calendarData.map((date, index) => {
          const selectable = isDateSelectable(date);
          const isTodayDate = isToday(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!selectable}
              className={`
                aspect-square p-2 text-sm rounded-lg transition-all flex items-center justify-center font-medium
                ${!date ? 'invisible' : ''}
                ${selectable 
                  ? 'hover:bg-indigo-100 hover:scale-105 cursor-pointer' 
                  : 'text-gray-300 cursor-not-allowed bg-gray-50'
                }
                ${isTodayDate ? 'bg-indigo-500 text-white hover:bg-indigo-600 ring-2 ring-indigo-300' : ''}
                ${selectable && !isTodayDate ? 'bg-white text-gray-800 border border-gray-200 hover:border-indigo-300' : ''}
              `}
              aria-label={date ? `${monthNames[date.getMonth()]} ${date.getDate()}` : ''}
            >
              {date ? date.getDate() : ''}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>📅</span>
          <span>Select dates up to 30 days from today</span>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}