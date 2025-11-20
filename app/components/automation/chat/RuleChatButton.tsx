import React from 'react';
import { ChatButton } from '@/types/chat';

interface ChatButtonProps {
  buttons: ChatButton[];
  onButtonClick: (button: ChatButton) => void;
}

export default function RuleChatButton({ buttons, onButtonClick }: ChatButtonProps) {
  // Handle keyboard navigation
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    button: ChatButton
  ) => {
    // Enter or Space to activate
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!button.disabled) {
        onButtonClick(button);
      }
    }
  };

  return (
    <div 
      className="flex flex-col gap-2 sm:gap-2.5 mb-3 sm:mb-4"
      role="group"
      aria-label="Option"
    >
      {buttons.map((button, index) => {
        // Determine button style based on type
        const isPrimary = button.isPrimary;
        const isEscalation = button.isEscalation;
        const isDisabled = button.disabled;

        // ✨ IMPROVED: Better responsive button styles
        const baseClasses = `
          w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left text-sm sm:text-base font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          break-words
        `;

        const stateClasses = isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : isPrimary
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md hover:shadow-lg active:scale-[0.98] sm:active:scale-95'
          : isEscalation
          ? 'bg-amber-50 border-2 border-amber-400 text-amber-800 hover:bg-amber-100 hover:border-amber-500 focus:ring-amber-400 active:scale-[0.98] sm:active:scale-95'
          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-400 active:scale-[0.98] sm:active:scale-95 shadow-sm hover:shadow';

        return (
          <button
            key={button.id}
            onClick={() => !isDisabled && onButtonClick(button)}
            onKeyDown={(e) => handleKeyDown(e, button)}
            disabled={isDisabled}
            className={`${baseClasses} ${stateClasses}`}
            aria-label={button.ariaLabel || button.label}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            type="button"
          >
            {/* Visual indicator for escalation buttons */}
            {isEscalation && (
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <span aria-hidden="true" className="text-base sm:text-lg">👤</span>
                <span className="flex-1">{button.label}</span>
              </span>
            )}
            
            {/* Visual indicator for primary buttons */}
            {isPrimary && !isEscalation && (
              <span className="inline-flex items-center justify-between gap-2">
                <span className="flex-1">{button.label}</span>
                <span aria-hidden="true" className="text-sm sm:text-base flex-shrink-0">→</span>
              </span>
            )}
            
            {/* Regular buttons */}
            {!isPrimary && !isEscalation && (
              <span className="block">{button.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
