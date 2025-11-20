'use client';

import { useState, useEffect } from 'react';
import RuleChatWindow from './RuleChatWindow';
import { BotScenarioData } from '@/types/chat';
import { MessageCircle, Coffee } from 'lucide-react';

export type ChatButtonStyle = 'simple' | 'expandable' | 'bubble' | 'bar' | 'cafe' | 'sideTab' | 'docked' | 'peek' | 'peekWide' | 'bottomFull' | 'bottomFloat' | 'bottomExpand';

interface MultiStyleChatButtonProps {
  scenarioData: BotScenarioData;
  botName?: string;
  style?: ChatButtonStyle;
}

export default function MultiStyleChatButton({
  scenarioData,
  botName = 'Signal Bot',
  style = 'peekWide',
}: MultiStyleChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Style 1: Simple Circle (現在のスタイル)
  const SimpleButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center text-xl sm:text-2xl z-50 animate-pulse"
      aria-label="Open chat"
    >
      💬
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
    </button>
  );

  // Style 2: Expandable (展開式)
  const ExpandableButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group ${
        isHovered ? 'pr-4 sm:pr-6 pl-3 sm:pl-4' : 'w-14 h-14 sm:w-16 sm:h-16'
      }`}
      aria-label="Open chat"
      style={{
        height: window.innerWidth < 640 ? '56px' : '64px',
        minWidth: isHovered ? (window.innerWidth < 640 ? '200px' : '240px') : (window.innerWidth < 640 ? '56px' : '64px'),
      }}
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
      <span
        className={`ml-2 sm:ml-3 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
        }`}
      >
        Chat & Reserve
      </span>
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
    </button>
  );

  // Style 3: Message Bubble (メッセージバブル型)
  const BubbleButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-white text-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 sm:gap-3 px-3 py-3 sm:px-5 sm:py-4 z-50 border-2 border-indigo-200 hover:border-indigo-400 animate-bounce-slow max-w-[240px] sm:max-w-[280px]"
      aria-label="Open chat"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-xs sm:text-sm truncate">Need help?</div>
        <div className="text-[10px] sm:text-xs text-gray-600 truncate">Chat with us! 👋</div>
      </div>
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
    </button>
  );

  // Style 4: Floating Bar (フローティングバー)
  const BarButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 z-50 hover:scale-105 min-w-[240px] sm:min-w-[320px]"
      aria-label="Open chat"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-sm sm:text-base truncate">Chat with us</div>
        <div className="text-[10px] sm:text-xs text-white/80 truncate">Reply in ~5 min</div>
      </div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
    </button>
  );

  // Style 5: Cafe Theme (カフェテーマ)
  const CafeButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group hover:scale-110"
      aria-label="Open chat"
      style={{
        width: isHovered ? 'auto' : (window.innerWidth < 640 ? '56px' : '64px'),
        height: window.innerWidth < 640 ? '56px' : '64px',
        padding: isHovered ? (window.innerWidth < 640 ? '0 16px' : '0 24px') : '0',
      }}
    >
      <Coffee className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
      <span
        className={`ml-2 sm:ml-3 font-bold text-base sm:text-lg whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
        }`}
      >
        ☕ Reserve
      </span>
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
    </button>
  );

  // Style 6: Side Tab (サイドタブ型) - 控えめで洗練
  const SideTabButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      aria-label="Open chat"
      style={{
        writingMode: 'vertical-rl',
        borderTopLeftRadius: window.innerWidth < 640 ? '8px' : '12px',
        borderBottomLeftRadius: window.innerWidth < 640 ? '8px' : '12px',
        padding: window.innerWidth < 640 ? '16px 10px' : '20px 12px',
        transform: 'translateY(-50%)',
      }}
    >
      <span className="text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1.5 sm:gap-2">
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ transform: 'rotate(-90deg)' }} />
        <span className="hidden xs:inline sm:inline">CHAT</span>
      </span>
      <div className="absolute top-2 left-1.5 sm:left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
    </button>
  );

  // Style 7: Docked Panel (ドッキングパネル) - エレガント
  const DockedButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      className="fixed right-0 top-1/3 bg-white/95 backdrop-blur-sm text-gray-800 shadow-xl transition-all duration-500 z-50 border-l-4 border-indigo-500 hover:bg-white"
      aria-label="Open chat"
      style={{
        borderTopLeftRadius: window.innerWidth < 768 ? '12px' : '16px',
        borderBottomLeftRadius: window.innerWidth < 768 ? '12px' : '16px',
        padding: window.innerWidth < 768 ? '20px 12px' : '24px 16px',
        transform: isHovered ? 'translateX(0)' : (window.innerWidth < 640 ? 'translateX(12px)' : window.innerWidth < 768 ? 'translateX(16px)' : 'translateX(20px)'),
      }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div 
          className="text-[10px] sm:text-xs font-semibold text-gray-600 transition-all duration-300 hidden xs:block"
          style={{ 
            writingMode: 'vertical-rl',
            opacity: isHovered ? 1 : 0.7,
          }}
        >
          Help?
        </div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
    </button>
  );

  // Style 8: Corner Peek (角からチラ見) - さりげない
  const PeekButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-0 right-0 bg-gradient-to-tl from-indigo-500 to-purple-600 text-white shadow-2xl transition-all duration-500 z-50 overflow-hidden"
      aria-label="Open chat"
      style={{
        borderTopLeftRadius: window.innerWidth < 640 ? '24px' : '32px',
        width: isHovered ? (window.innerWidth < 640 ? '140px' : '180px') : (window.innerWidth < 640 ? '64px' : '80px'),
        height: isHovered ? (window.innerWidth < 640 ? '140px' : '180px') : (window.innerWidth < 640 ? '64px' : '80px'),
      }}
    >
      <div 
        className="absolute transition-all duration-500"
        style={{
          bottom: isHovered ? (window.innerWidth < 640 ? '20px' : '24px') : (window.innerWidth < 640 ? '14px' : '16px'),
          right: isHovered ? (window.innerWidth < 640 ? '20px' : '24px') : (window.innerWidth < 640 ? '14px' : '16px'),
        }}
      >
        <MessageCircle 
          className={`transition-all duration-500 ${isHovered ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6'}`}
        />
      </div>
      <div 
        className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-[10px] sm:text-xs font-semibold transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <div>Chat</div>
        <div className="text-[8px] sm:text-[10px] text-white/80">with us</div>
      </div>
      <div 
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />
    </button>
  );

  // Style 9: Corner Peek Wide (横長スリム) - スマートで目立つ
  const PeekWideButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-0 right-0 bg-gradient-to-tl from-indigo-500 to-purple-600 text-white shadow-2xl transition-all duration-500 z-50 flex items-center gap-2 sm:gap-3"
      aria-label="Open chat"
      style={{
        borderTopLeftRadius: window.innerWidth < 640 ? '20px' : '24px',
        height: window.innerWidth < 640 ? '48px' : '56px',
        width: isHovered 
          ? (window.innerWidth < 640 ? '180px' : '220px')
          : (window.innerWidth < 640 ? '140px' : '170px'),
        padding: window.innerWidth < 640 ? '0 16px 0 12px' : '0 20px 0 16px',
      }}
    >
      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
        {isHovered ? 'Chat with us!' : 'Need Help?'}
      </span>
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
    </button>
  );

  // Style 10: Full Width Bottom Bar (全幅バー) - 最強アピール力
  const BottomFullButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    
    if (!isVisible) return null;
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm sm:text-base truncate">Need help? We're online!</div>
              <div className="text-xs sm:text-sm text-white/90 truncate hidden sm:block">Chat with us to reserve a table</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-indigo-600 font-bold text-sm sm:text-base rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
            >
              Chat Now
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Style 10: Floating Bottom Bar (フローティングバー) - エレガント
  const BottomFloatButton = () => (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-2xl">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white text-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-2 border-indigo-200 hover:border-indigo-400"
        aria-label="Open chat"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-bold text-sm sm:text-base text-gray-900 truncate">Questions?</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Chat with us 💬</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm sm:text-base font-semibold text-indigo-600 hidden sm:inline">Online</span>
        </div>
      </button>
    </div>
  );

  // Style 11: Expandable Bottom Bar (展開式バー) - 控えめ
  const BottomExpandButton = () => (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 z-50"
        aria-label="Open chat"
        style={{
          padding: isHovered 
            ? (window.innerWidth < 640 ? '12px 24px' : '14px 32px')
            : (window.innerWidth < 640 ? '12px 16px' : '14px 20px'),
          minWidth: isHovered ? (window.innerWidth < 640 ? '200px' : '280px') : 'auto',
        }}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <span className={`font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
        }`}>
          Need help? Chat now!
        </span>
        <span className={`font-bold text-sm sm:text-base transition-all duration-300 ${
          isHovered ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100'
        }`}>
          Chat
        </span>
      </button>
    </div>
  );

  const renderButton = () => {
    switch (style) {
      case 'simple':
        return <SimpleButton />;
      case 'expandable':
        return <ExpandableButton />;
      case 'bubble':
        return <BubbleButton />;
      case 'bar':
        return <BarButton />;
      case 'cafe':
        return <CafeButton />;
      case 'sideTab':
        return <SideTabButton />;
      case 'docked':
        return <DockedButton />;
      case 'peek':
        return <PeekButton />;
      case 'peekWide':
        return <PeekWideButton />;
      case 'bottomFull':
        return <BottomFullButton />;
      case 'bottomFloat':
        return <BottomFloatButton />;
      case 'bottomExpand':
        return <BottomExpandButton />;
      default:
        return <SimpleButton />;
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && renderButton()}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Chat Window - Responsive */}
          <div className="fixed inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 md:right-6 md:left-auto md:w-[420px] lg:w-[440px] h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] md:h-[600px] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] z-50 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-300">
            <RuleChatWindow
              scenarioData={scenarioData}
              initialMessage="main"
              botName={botName}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </>
      )}

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
