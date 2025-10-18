import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useChatWidget } from '@/contexts/ChatWidgetContext';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatModalProps {
  containerMode?: boolean;
}

const ChatModal: React.FC<ChatModalProps> = ({ containerMode = false }) => {
  const { isOpen, closeWidget, messages, isTyping, error, clearError, config } = useChatWidget();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeWidget();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeWidget]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.chat-askbar')
      ) {
        closeWidget();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeWidget]);

  if (!isOpen) return null;

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="chat-modal__backdrop"
        style={{
          position: containerMode ? 'absolute' : 'fixed',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`chat-modal ${containerMode ? 'chat-modal--container' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
        style={{
          position: containerMode ? 'absolute' : 'fixed',
          zIndex: 1001,
        }}
      >
        {/* Header */}
        <div className="chat-modal__header">
          <div className="flex items-center gap-3">
            {config.logo && (
              <img src={config.logo} alt="Logo" className="h-6 w-auto" />
            )}
            <h2 id="chat-modal-title" className="text-base font-semibold text-gray-900">
              {config.title}
            </h2>
          </div>
          <button
            onClick={closeWidget}
            className="chat-modal__close"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-modal__messages">
          {messages.length === 0 ? (
            // Welcome state with suggested questions
            <div className="chat-modal__welcome">
              <div className="text-center mb-6">
                {config.showFloatingAvatar && config.avatar && (
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-gray-200">
                    <img src={config.avatar} alt="Assistant" className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome! How can I help you?
                </h3>
                <p className="text-sm text-gray-600">
                  Ask me anything or try one of these questions:
                </p>
              </div>

              {config.suggestedQuestions.length > 0 && (
                <div className="space-y-2">
                  {config.suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const event = new CustomEvent('sendSuggestedQuestion', { detail: question });
                        window.dispatchEvent(event);
                      }}
                      className="chat-modal__suggested-question"
                      style={{
                        borderColor: `${config.primaryColor}20`,
                      }}
                    >
                      <span className="text-sm text-gray-700">{question}</span>
                      <ArrowUpRight 
                        className="w-4 h-4 flex-shrink-0" 
                        style={{ color: config.primaryColor }}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Messages list
            <>
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp);

                return (
                  <React.Fragment key={message.id}>
                    {showDate && (
                      <div className="chat-modal__date-divider">
                        {formatMessageDate(message.timestamp)}
                      </div>
                    )}

                    <div className={`chat-message chat-message--${message.role}`}>
                      {/* Avatar */}
                      <div className="chat-message__avatar">
                        {message.role === 'assistant' ? (
                          config.avatar ? (
                            <img src={config.avatar} alt="Assistant" className="w-full h-full object-cover" />
                          ) : (
                            <div 
                              className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              AI
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium">
                            {getInitials('User')}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="chat-message__content">
                        <div className="chat-message__bubble">
                          {message.content}
                        </div>

                        {/* Sources (only for assistant) */}
                        {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                          <div className="chat-message__sources">
                            {message.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-message__source-chip"
                                style={{
                                  backgroundColor: `${config.primaryColor}10`,
                                  color: config.primaryColor,
                                }}
                              >
                                <span className="text-xs">{source.title}</span>
                                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="chat-message chat-message--assistant">
                  <div className="chat-message__avatar">
                    {config.avatar ? (
                      <img src={config.avatar} alt="Assistant" className="w-full h-full object-cover" />
                    ) : (
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        AI
                      </div>
                    )}
                  </div>
                  <div className="chat-message__content">
                    <div className="chat-message__bubble">
                      <div className="chat-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="px-6 py-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">!</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          {error.code === 'NO_TRAINING_DATA' ? 'No Training Data' : 'Error'}
                        </p>
                        <p className="text-sm text-red-600">{error.message}</p>
                        {error.retry && (
                          <button
                            onClick={() => {
                              clearError();
                              error.retry?.();
                            }}
                            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                      <button
                        onClick={clearError}
                        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatModal;
