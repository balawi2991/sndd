import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Date utilities
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const formatDateDivider = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

const groupMessagesByDate = (messages: Message[]) => {
  const groups: Array<{ date: string; dateObj: Date; messages: Message[] }> = [];
  
  messages.forEach((msg) => {
    const msgDate = new Date(msg.timestamp);
    const dateStr = formatDateDivider(msgDate);
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.date === dateStr) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ 
        date: dateStr, 
        dateObj: msgDate,
        messages: [msg] 
      });
    }
  });
  
  return groups;
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url?: string }>;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  title?: string;
  logo?: string;
  avatar?: string;
  showFloatingAvatar?: boolean;
  primaryColor?: string;
  suggestedQuestions?: string[];
  onQuestionClick?: (question: string) => void;
  isTyping?: boolean;
  containerType?: 'viewport' | 'preview';
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  title = 'Chat with us',
  logo,
  avatar,
  showFloatingAvatar = true,
  primaryColor = '#17B26A',
  suggestedQuestions = [],
  onQuestionClick,
  isTyping = false,
  containerType = 'viewport',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus trap and Esc key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Don't steal focus - let the AskBar keep it
    // The user is typing, so focus should stay in the input

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showSuggestions = messages.length === 0 && suggestedQuestions.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="mintchat-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`mintchat-modal ${containerType === 'preview' ? 'mintchat-modal--preview' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
        style={{
          '--primary-color': primaryColor,
        } as React.CSSProperties}
      >
        {/* Header */}
        <div className="mintchat-modal__header">
          <div className="flex items-center gap-3">
            {logo && (
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            )}
            <h2 id="chat-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mintchat-modal__close"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="mintchat-modal__content" ref={scrollRef}>
          {showSuggestions ? (
            <div className="mintchat-suggestions">
              <p className="text-sm text-gray-600 mb-4">
                Here are some questions you can ask:
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(question)}
                    className="mintchat-suggestion-btn"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mintchat-messages">
              {groupMessagesByDate(messages).map((group, groupIndex) => (
                <div key={groupIndex} className="mintchat-message-group">
                  {/* Date Divider */}
                  <div className="mintchat-date-divider">
                    <span className="mintchat-date-divider__text">{group.date}</span>
                  </div>
                  
                  {/* Messages for this date */}
                  {group.messages.map((msg, msgIndex) => (
                    <div
                      key={`${groupIndex}-${msgIndex}`}
                      className={`mintchat-message mintchat-message--${msg.role}`}
                    >
                      {msg.role === 'assistant' && showFloatingAvatar && (
                        <Avatar className="mintchat-message__avatar">
                          <AvatarImage src={avatar} />
                          <AvatarFallback style={{ backgroundColor: primaryColor }}>
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="mintchat-message__content">
                        <div className="mintchat-message__bubble">
                          {msg.content}
                        </div>
                        
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mintchat-message__sources">
                            {msg.sources.map((source, idx) => (
                              source.url ? (
                                <a
                                  key={idx}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mintchat-source-chip"
                                >
                                  <Badge variant="outline">
                                    {source.title}
                                  </Badge>
                                </a>
                              ) : (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="mintchat-source-chip"
                                >
                                  {source.title}
                                </Badge>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.role === 'user' && showFloatingAvatar && (
                        <Avatar className="mintchat-message__avatar">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              
              {isTyping && (
                <div className="mintchat-message mintchat-message--assistant">
                  {showFloatingAvatar && (
                    <Avatar className="mintchat-message__avatar">
                      <AvatarImage src={avatar} />
                      <AvatarFallback style={{ backgroundColor: primaryColor }}>
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="mintchat-message__content">
                    <div className="mintchat-message__bubble">
                      <div className="mintchat-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatModal;
