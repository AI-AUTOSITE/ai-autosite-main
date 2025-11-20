'use client';

import { ChatMessage } from '@/types/chat';

interface RuleChatMessageProps {
  message: ChatMessage;
  botName?: string;
}

// Helper function to convert phone numbers and markdown links to clickable links
function parseMessageContent(content: string): string {
  // Pattern 1: Markdown link format [text](tel:number)
  const markdownLinkPattern = /\[([^\]]+)\]\(tel:([^)]+)\)/g;
  
  // Pattern 2: Phone number in parentheses format: (XXX) XXX-XXXX
  const phonePattern = /(\(\d{3}\)\s*\d{3}-\d{4})/g;
  
  // First, replace markdown links
  let processedContent = content.replace(markdownLinkPattern, (match, text, number) => {
    return `<a href="tel:${number}" class="text-indigo-600 hover:text-indigo-800 underline font-semibold transition-colors">${text}</a>`;
  });
  
  // Then, replace standalone phone numbers (if not already in a link)
  processedContent = processedContent.replace(phonePattern, (match) => {
    // Check if already in a link tag
    const beforeMatch = processedContent.substring(0, processedContent.indexOf(match));
    if (beforeMatch.includes('<a href=') && !beforeMatch.includes('</a>')) {
      return match; // Already in a link, don't wrap again
    }
    // Convert to tel: format (remove spaces and special chars)
    const telNumber = match.replace(/[^0-9]/g, '');
    return `<a href="tel:+1${telNumber}" class="text-indigo-600 hover:text-indigo-800 underline font-semibold transition-colors">${match}</a>`;
  });
  
  return processedContent;
}

export default function RuleChatMessage({ message, botName = 'Signal Bot' }: RuleChatMessageProps) {
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';
  const isError = message.type === 'error';

  // ✨ IMPROVED: System messages with better mobile spacing
  if (isSystem) {
    return (
      <div 
        className="flex justify-center mb-3 sm:mb-4"
        role="alert"
        aria-live="assertive"
      >
        <div className={`
          max-w-[90%] sm:max-w-[85%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm text-center
          ${isError 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-blue-50 text-blue-800 border border-blue-200'
          }
        `}>
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // ✨ IMPROVED: Bot messages with better responsive sizing
  if (isBot) {
    const processedContent = parseMessageContent(message.content);
    
    return (
      <div className="flex justify-start mb-3 sm:mb-4">
        <div className="max-w-[90%] sm:max-w-[85%]">
          {/* Bot header with icon - Better sizing */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <div 
              className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs sm:text-sm"
              aria-hidden="true"
            >
              🤖
            </div>
            <span className="text-xs font-semibold text-gray-600" aria-label={`Message from ${botName}`}>
              {botName}
            </span>
          </div>
          
          {/* Bot message bubble with HTML support for links - Better padding */}
          <div 
            className="bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 shadow-md border border-gray-100"
            role="article"
            aria-label="Bot message"
          >
            <div 
              className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
          
          {/* Timestamp (optional, for accessibility) */}
          <time 
            className="text-xs text-gray-400 mt-1 block sr-only"
            dateTime={message.timestamp.toISOString()}
          >
            {message.timestamp.toLocaleTimeString('ja-JP', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
        </div>
      </div>
    );
  }

  // ✨ IMPROVED: User message with better responsive sizing
  return (
    <div className="flex justify-end mb-3 sm:mb-4">
      <div className="max-w-[90%] sm:max-w-[85%]">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 shadow-md"
          role="article"
          aria-label="Your message"
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        
        {/* Timestamp (optional, for accessibility) */}
        <time 
          className="text-xs text-gray-400 mt-1 block text-right sr-only"
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
    </div>
  );
}
