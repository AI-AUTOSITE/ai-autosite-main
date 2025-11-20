'use client';

import { useState } from 'react';

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  onCancel: () => void;
  selectedDate?: string; // NEW: Pass the selected date to determine day of week
}

// Generate time slots every 30 minutes
const generateTimeSlots = (selectedDate?: string) => {
  const slots: { value: string; label: string; period: string }[] = [];
  
  // Determine if selected date is weekend
  let isWeekend = false;
  if (selectedDate) {
    // Parse date string like "Nov 21 (Fri)"
    const dayMatch = selectedDate.match(/\((Sun|Mon|Tue|Wed|Thu|Fri|Sat)\)/);
    if (dayMatch) {
      const day = dayMatch[1];
      isWeekend = (day === 'Sat' || day === 'Sun');
    }
  }
  
  // Breakfast: 8:00 AM - 11:00 AM (same for weekdays and weekends)
  for (let hour = 8; hour <= 11; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 11 && min === 30) break; // Stop at 11:00 AM
      const time24 = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour;
      const ampm = 'AM';
      const label = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
      slots.push({ value: time24, label, period: 'breakfast' });
    }
  }
  
  // Lunch: 11:30 AM - 3:00 PM (same for weekdays and weekends)
  for (let hour = 11; hour <= 15; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 11 && min === 0) continue; // Skip 11:00 (already in breakfast)
      if (hour === 15 && min === 30) break; // Stop at 3:00 PM
      const time24 = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const label = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
      slots.push({ value: time24, label, period: 'lunch' });
    }
  }
  
  // Dinner: Different times for weekdays vs weekends
  // Weekdays: 5:00 PM - 8:00 PM
  // Weekends: 5:00 PM - 7:00 PM
  const dinnerEndHour = isWeekend ? 19 : 20; // 7 PM for weekends, 8 PM for weekdays
  for (let hour = 17; hour <= dinnerEndHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === dinnerEndHour && min === 30) break;
      const time24 = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const hour12 = hour - 12;
      const label = `${hour12}:${min.toString().padStart(2, '0')} PM`;
      slots.push({ value: time24, label, period: 'dinner' });
    }
  }
  
  return slots;
};

export default function TimePicker({ onTimeSelect, onCancel, selectedDate }: TimePickerProps) {
  const timeSlots = generateTimeSlots(selectedDate);
  const [selectedTime, setSelectedTime] = useState('');

  // Determine if selected date is weekend
  let isWeekend = false;
  if (selectedDate) {
    const dayMatch = selectedDate.match(/\((Sun|Mon|Tue|Wed|Thu|Fri|Sat)\)/);
    if (dayMatch) {
      const day = dayMatch[1];
      isWeekend = (day === 'Sat' || day === 'Sun');
    }
  }

  const handleConfirm = () => {
    if (selectedTime) {
      const slot = timeSlots.find(s => s.value === selectedTime);
      if (slot) {
        onTimeSelect(slot.label);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 animate-fade-in">
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Select Time</h3>
        <p className="text-sm text-gray-600">
          We're open:
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <div>🌅 Breakfast: 8:00 AM - 11:00 AM</div>
          <div>🍽️ Lunch: 11:30 AM - 3:00 PM</div>
          <div>🌆 Dinner: 5:00 PM - {isWeekend ? '7:00 PM' : '8:00 PM'}</div>
        </div>
      </div>

      {/* Native Select - Shows drum picker on mobile */}
      <select
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white text-gray-900
                   appearance-none cursor-pointer"
        aria-label="Select reservation time"
      >
        <option value="" disabled>
          Choose a time...
        </option>
        
        <optgroup label="🌅 Breakfast">
          {timeSlots.filter(s => s.period === 'breakfast').map(slot => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="🍽️ Lunch">
          {timeSlots.filter(s => s.period === 'lunch').map(slot => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="🌆 Dinner">
          {timeSlots.filter(s => s.period === 'dinner').map(slot => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </optgroup>
      </select>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 
                     bg-gray-100 rounded-lg hover:bg-gray-200 
                     transition-colors duration-200"
          aria-label="Cancel time selection"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedTime}
          className="flex-1 px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg hover:bg-blue-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200"
          aria-label="Confirm time selection"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
