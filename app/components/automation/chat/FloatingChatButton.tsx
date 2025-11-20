'use client';

import { useState, useEffect } from 'react';
import RuleChatWindow from './RuleChatWindow';
import { BotScenarioData } from '@/types/chat';

interface FloatingChatButtonProps {
  scenarioData: BotScenarioData;
  botName?: string;
  buttonText?: string;
  primaryColor?: string;
}

export default function FloatingChatButton({
  scenarioData,
  botName = 'Signal Bot',
  buttonText = 'Chat',
  primaryColor = 'from-indigo-500 to-purple-600',
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`
            fixed bottom-6 right-6 
            bg-gradient-to-r ${primaryColor}
            text-white px-6 py-4 rounded-full 
            shadow-lg hover:shadow-2xl 
            transition-all duration-300 
            hover:scale-110 
            z-50
            flex items-center gap-3
            group
          `}
          aria-label="Open chat"
        >
          {/* Icon */}
          <span className="text-2xl" aria-hidden="true">💬</span>
          
          {/* Text (hidden on mobile) */}
          <span className="font-semibold hidden sm:inline">
            {buttonText}
          </span>

          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" 
               aria-label="New notification" />
        </button>
      )}

      {/* Chat Window - Desktop */}
      {isOpen && (
        <>
          {/* Desktop View (md and up) */}
          <div className="hidden md:block fixed bottom-6 right-6 h-[50vh] max-h-[600px] w-[400px] shadow-2xl rounded-lg z-50 animate-slideUp">
            <RuleChatWindow
              scenarioData={scenarioData}
              botName={botName}
              onClose={() => setIsOpen(false)}
            />
          </div>

          {/* Mobile View (below md) */}
          <div className="md:hidden fixed inset-0 z-50 animate-fadeIn">
            <div className="w-full h-full">
              <RuleChatWindow
                scenarioData={scenarioData}
                botName={botName}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>

          {/* Backdrop for mobile (optional dimming effect) */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        </>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}