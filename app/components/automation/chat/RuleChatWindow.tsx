'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatButton, ChatState, BotScenarioData, UserData } from '@/types/chat';
import RuleChatMessage from './RuleChatMessage';
import RuleChatButton from './RuleChatButton';
import CalendarPicker from './CalendarPicker';
import TimePicker from './TimePicker';

interface RuleChatWindowProps {
  scenarioData: BotScenarioData;
  initialMessage?: string;
  botName?: string;
  onClose?: () => void; // Optional close handler
}

export default function RuleChatWindow({
  scenarioData,
  initialMessage = 'main',
  botName = 'Signal Bot',
  onClose,
}: RuleChatWindowProps) {
  // Chat state - Memory only (Privacy protected)
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    currentStep: initialMessage,
    userData: {
      conversationPath: [],
    },
    errorCount: 0,
    isEscalated: false,
    conversationStartTime: new Date(),
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [currentButtons, setCurrentButtons] = useState<ChatButton[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const isInitialized = useRef(false);
  
  // Month names for date formatting
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize chat - Execute only once
  useEffect(() => {
    if (!isInitialized.current && chatState.messages.length === 0) {
      isInitialized.current = true;
      handleBotResponse(initialMessage);
    }
  }, []);

  // Auto scroll - Execute when new messages are added (chat only)
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Smooth scroll using scrollTo
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatState.messages, showCalendar, showTimePicker, currentButtons]);

  // Generate unique message ID
  const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add bot message
  const addBotMessage = (content: string, buttons?: ChatButton[]) => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'bot',
      type: buttons ? 'button' : 'text',
      content,
      timestamp: new Date(),
      buttons,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isTyping: false,
    }));

    if (buttons) {
      setCurrentButtons(buttons);
    } else {
      setCurrentButtons([]);
    }
  };

  // Add user message
  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'user',
      type: 'text',
      content,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Clear current buttons
    setCurrentButtons([]);
  };

  // Add system message (for errors, etc.)
  const addSystemMessage = (content: string, type: 'error' | 'info' = 'info') => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'system',
      type: type === 'error' ? 'error' : 'info',
      content,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  // Handle bot response
  const handleBotResponse = (stepId: string, additionalUserData?: Partial<UserData>) => {
    const node = scenarioData[stepId];
    
    if (!node) {
      console.error(`Step not found: ${stepId}`);
      
      // Error handling: When scenario is not found
      addSystemMessage(
        'We apologize. A system error has occurred. Returning to main menu.',
        'error'
      );
      
      setTimeout(() => {
        handleBotResponse('main');
      }, 1500);
      
      return;
    }

    // Merge additional user data if provided
    if (additionalUserData) {
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          ...additionalUserData,
        },
      }));
    }

    // Show typing indicator
    setChatState((prev) => ({ ...prev, isTyping: true }));

    // Simulate typing delay
    setTimeout(() => {
      // Execute action if exists
      if (node.action && chatState.userData) {
        node.action(chatState.userData);
      }

      // Get the current userData (with merged additionalUserData if any)
      const currentUserData = additionalUserData 
        ? { ...chatState.userData, ...additionalUserData }
        : chatState.userData;

      // Get message (support both string and function)
      const message = typeof node.message === 'function' 
        ? node.message(currentUserData || {})
        : node.message;

      // Add bot message
      addBotMessage(message, node.buttons);

      // Update current step
      setChatState((prev) => ({
        ...prev,
        currentStep: node.id,
      }));
    }, 1200);
  };

  // ✨ FIXED: Handle button click with proper userData saving
  const handleButtonClick = (button: ChatButton) => {
    // Add user message
    addUserMessage(button.label);
    
    // Hide buttons immediately
    setCurrentButtons([]);

    // Track escalation
    if (button.isEscalation) {
      setChatState((prev) => ({
        ...prev,
        isEscalated: true,
      }));
    }

    // When calendar display is needed
    if (button.action === 'reservation-calendar') {
      // Show typing indicator before displaying calendar
      setChatState((prev) => ({ ...prev, isTyping: true }));
      
      setTimeout(() => {
        setChatState((prev) => ({ ...prev, isTyping: false }));
        setShowCalendar(true);
      }, 1000);
      return;
    }

    // When time picker display is needed
    if (button.action === 'show-time-picker') {
      // Show typing indicator before displaying time picker
      setChatState((prev) => ({ ...prev, isTyping: true }));
      
      setTimeout(() => {
        setChatState((prev) => ({ ...prev, isTyping: false }));
        setShowTimePicker(true);
      }, 1000);
      return;
    }

    // ✨ Save user data based on button context
    
    // Save party size AND navigate with updated data
    if (button.action === 'reservation-date') {
      const numberOfPeople = button.value || button.label;
      
      // Save to state
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          numberOfPeople,
        },
      }));
      
      // Navigate with updated data immediately
      setTimeout(() => {
        handleBotResponse(button.action, { numberOfPeople });
      }, 800);
      return; // Prevent double navigation
    }

    // Save selected date (Today, Tomorrow, Day After Tomorrow, Weekend)
    if (button.action === 'reservation-time' && button.value) {
      const now = new Date();
      let displayDate = '';
      
      if (button.value === 'today') {
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
        displayDate = `${monthNames[month - 1]} ${day} (${dayOfWeek})`;
      } else if (button.value === 'tomorrow') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const month = tomorrow.getMonth() + 1;
        const day = tomorrow.getDate();
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][tomorrow.getDay()];
        displayDate = `${monthNames[month - 1]} ${day} (${dayOfWeek})`;
      } else if (button.value === '2days') {
        const dayAfter = new Date(now);
        dayAfter.setDate(dayAfter.getDate() + 2);
        const month = dayAfter.getMonth() + 1;
        const day = dayAfter.getDate();
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayAfter.getDay()];
        displayDate = `${monthNames[month - 1]} ${day} (${dayOfWeek})`;
      } else if (button.value === '3days') {
        const threeDays = new Date(now);
        threeDays.setDate(threeDays.getDate() + 3);
        const month = threeDays.getMonth() + 1;
        const day = threeDays.getDate();
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][threeDays.getDay()];
        displayDate = `${monthNames[month - 1]} ${day} (${dayOfWeek})`;
      } else if (button.value === 'weekend') {
        const weekend = new Date(now);
        // Find next Saturday
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
        weekend.setDate(weekend.getDate() + daysUntilSaturday);
        const month = weekend.getMonth() + 1;
        const day = weekend.getDate();
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekend.getDay()];
        displayDate = `${monthNames[month - 1]} ${day} (${dayOfWeek})`;
      }
      
      // Save to state
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          reservationDate: displayDate || button.label,
        },
      }));
      
      // Navigate with updated data immediately
      setTimeout(() => {
        handleBotResponse(button.action, { reservationDate: displayDate || button.label });
      }, 800);
      return; // Prevent double navigation
    }

    // Save customer name AND navigate with updated data
    if (button.action === 'reservation-contact-method') {
      const customerName = button.value || button.label;
      
      // Save to state
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          customerName,
        },
      }));
      
      // Navigate with updated data immediately
      setTimeout(() => {
        handleBotResponse(button.action, { customerName });
      }, 800);
      return; // Prevent double navigation
    }

    // Save contact method
    if (button.action === 'reservation-contact-info') {
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          contactMethod: button.value || button.label,
        },
      }));
    }

    // Save contact info AND navigate with updated data
    if (button.action === 'reservation-special-request') {
      const contactInfo = button.value || button.label;
      
      // Save to state
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          contactInfo,
        },
      }));
      
      // Navigate with updated data immediately
      setTimeout(() => {
        handleBotResponse(button.action, { contactInfo });
      }, 800);
      return; // Prevent double navigation
    }

    // Save special request AND navigate with updated data
    if (button.action === 'reservation-confirm') {
      const specialRequest = button.value || button.label;
      
      // Save to state (for future use)
      setChatState((prev) => ({
        ...prev,
        userData: {
          ...prev.userData,
          specialRequest,
        },
      }));
      
      // Navigate with updated data immediately
      setTimeout(() => {
        handleBotResponse(button.action, { specialRequest });
      }, 800);
      return; // Prevent double navigation
    }

    // Navigate to next step
    if (button.nextStep) {
      setTimeout(() => {
        handleBotResponse(button.nextStep!);
      }, 800);
    } else if (button.action) {
      setTimeout(() => {
        handleBotResponse(button.action);
      }, 800);
    }
  };

  // Handle calendar date selection
  const handleDateSelect = (date: Date) => {
    // Hide calendar
    setShowCalendar(false);

    // Display date
    const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    
    addUserMessage(`${dateStr} (${dayOfWeek})`);

    // Save selected date
    setChatState((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        selectedDate: date.toISOString(),
        reservationDate: `${dateStr} (${dayOfWeek})`,
      },
    }));

    // Go to time selection
    handleBotResponse('reservation-time-select');
  };
  
  // Handle time selection from TimePicker
  const handleTimeSelect = (time: string) => {
    // Hide time picker
    setShowTimePicker(false);
    
    // Add user message
    addUserMessage(time);
    
    // Save selected time to userData
    setChatState((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        reservationTime: time,
      },
    }));
    
    // Move to next step (contact name)
    setTimeout(() => {
      handleBotResponse('reservation-contact-name');
    }, 500);
  };

  // Handle calendar cancel
  const handleCalendarCancel = () => {
    setShowCalendar(false);
    handleBotResponse('reservation-date');
  };

  // Handle time picker cancel
  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
    // Go back to date selection
    handleBotResponse('reservation-date');
  };

  // Reset chat
  const handleReset = () => {
    setChatState({
      messages: [],
      isTyping: false,
      currentStep: initialMessage,
      userData: {
        conversationPath: [],
      },
      errorCount: 0,
      isEscalated: false,
      conversationStartTime: new Date(),
    });
    setCurrentButtons([]);
    setShowCalendar(false);
    isInitialized.current = false;
    
    // Re-initialize
    setTimeout(() => {
      isInitialized.current = true;
      handleBotResponse(initialMessage);
    }, 300);
  };

  // Handle close (if embedded in page)
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // If no close handler, just reset
      handleReset();
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-white overflow-hidden rounded-2xl shadow-2xl"
      role="region"
      aria-label="Chatbot conversation window"
    >
      {/* ✨ IMPROVED: Responsive Header with better mobile layout */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-3 sm:py-4 flex-shrink-0 flex items-center justify-between shadow-md rounded-t-2xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
            aria-hidden="true"
          >
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg truncate">{botName}</h3>
            <p className="text-xs sm:text-sm text-white/80 truncate" role="status" aria-live="polite">
              {chatState.isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Reset button - Responsive sizing */}
          <button
            onClick={handleReset}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Reset conversation"
            title="Reset conversation"
          >
            <span className="hidden sm:inline">🔄 Reset</span>
            <span className="sm:hidden text-base">🔄</span>
          </button>
          
          {/* Close button - Better sizing */}
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close chat"
            title="Close chat"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ✨ IMPROVED: Messages area with better spacing and max-width for readability */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gray-50 scroll-smooth"
        role="log"
        aria-label="Chat message history"
        aria-live="polite"
        aria-atomic="false"
      >
        {chatState.messages.map((message: ChatMessage) => (
          <RuleChatMessage key={message.id} message={message} botName={botName} />
        ))}

        {/* Calendar - Better mobile layout */}
        {showCalendar && (
          <div className="flex justify-start mb-3 sm:mb-4">
            <div className="max-w-full sm:max-w-[90%]">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs sm:text-sm"
                  aria-hidden="true"
                >
                  🤖
                </div>
                <span className="text-xs font-semibold text-gray-600">{botName}</span>
              </div>
              <CalendarPicker
                onDateSelect={handleDateSelect}
                onCancel={handleCalendarCancel}
              />
            </div>
          </div>
        )}

        {/* Time Picker - Better mobile layout */}
        {showTimePicker && (
          <div className="flex justify-start mb-3 sm:mb-4">
            <div className="max-w-full sm:max-w-[90%]">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs sm:text-sm"
                  aria-hidden="true"
                >
                  🤖
                </div>
                <span className="text-xs font-semibold text-gray-600">{botName}</span>
              </div>
              <TimePicker
                onTimeSelect={handleTimeSelect}
                onCancel={handleTimePickerCancel}
                selectedDate={chatState.userData.reservationDate}
              />
            </div>
          </div>
        )}

        {/* Typing indicator - Better sizing */}
        {chatState.isTyping && (
          <div className="flex justify-start mb-3 sm:mb-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs sm:text-sm"
                  aria-hidden="true"
                >
                  🤖
                </div>
                <span className="text-xs font-semibold text-gray-600">{botName}</span>
              </div>
              <div className="bg-white rounded-lg px-4 sm:px-5 py-3 sm:py-4 shadow-md border border-gray-100">
                <div className="flex gap-1.5" role="status" aria-label="Bot is typing">
                  <div 
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-400 rounded-full animate-bounce" 
                    style={{ animationDelay: '0ms' }}
                    aria-hidden="true"
                  ></div>
                  <div 
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-400 rounded-full animate-bounce" 
                    style={{ animationDelay: '150ms' }}
                    aria-hidden="true"
                  ></div>
                  <div 
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-400 rounded-full animate-bounce" 
                    style={{ animationDelay: '300ms' }}
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons - Better spacing */}
        {!showCalendar && currentButtons.length > 0 && (
          <div className="pt-2 max-w-full" role="group" aria-label="Response options">
            <RuleChatButton buttons={currentButtons} onButtonClick={handleButtonClick} />
          </div>
        )}
      </div>

      {/* ✨ IMPROVED: Footer with better mobile spacing */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 text-center rounded-b-2xl flex-shrink-0">
        <p className="text-xs sm:text-sm text-gray-500">
          💡 This is a demo. No actual reservations will be made.
        </p>
      </div>
    </div>
  );
}