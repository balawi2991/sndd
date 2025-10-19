import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import './ChatWidget.css';

export interface WidgetConfig {
  primaryColor?: string;
  glowingBorder?: boolean;
  title?: string;
  placeholder?: string;
  agentAvatar?: string;
  suggestedQuestions?: string[];
}

export interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url?: string }>;
  timestamp: Date;
}

interface ChatWidgetProps {
  config?: WidgetConfig;
  messages?: WidgetMessage[];
  onSendMessage?: (message: string) => void;
  isTyping?: boolean;
  containerAware?: boolean;
}

export function ChatWidget({
  config = {},
  messages = [],
  onSendMessage,
  isTyping = false,
  containerAware = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    primaryColor = '#17B26A',
    glowingBorder = true,
    title = 'Chat with us',
    placeholder = 'Ask me anything...',
    agentAvatar,
    suggestedQuestions = [],
  } = config;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Open modal on first character
    if (value.length === 1 && !isOpen) {
      setIsOpen(true);
    }

    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleSend = () => {
    if (!inputValue.trim() || !onSendMessage) return;

    onSendMessage(inputValue.trim());
    setInputValue('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const groupMessagesByDate = (msgs: WidgetMessage[]) => {
    const groups: { [key: string]: WidgetMessage[] } = {};
    
    msgs.forEach(msg => {
      const dateKey = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(msg.timestamp);
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div 
      className={cn(
        'chat-widget-container',
        containerAware && 'container-aware'
      )}
      style={{ '--primary-color': primaryColor } as React.CSSProperties}
    >
      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="chat-widget-backdrop"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Modal */}
          <div 
            className="chat-widget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
          >
            {/* Header */}
            <div className="chat-widget-header">
              <div className="flex items-center gap-3">
                {agentAvatar && (
                  <img 
                    src={agentAvatar} 
                    alt="Agent" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <h2 id="chat-title" className="font-semibold text-gray-900">
                  {title}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-widget-close-btn"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-widget-messages">
              {messages.length === 0 && suggestedQuestions.length > 0 && (
                <div className="chat-widget-suggestions">
                  <p className="text-sm text-gray-600 mb-3">
                    Suggested questions:
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestedQuestion(q)}
                        className="chat-widget-suggestion-btn"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date}>
                  <div className="chat-widget-date-divider">
                    {date === new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date()) ? 'Today' : date}
                  </div>

                  {msgs.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'chat-widget-message',
                        msg.role === 'user' ? 'user' : 'assistant'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <div className="chat-widget-avatar">
                          {agentAvatar ? (
                            <img src={agentAvatar} alt="AI" />
                          ) : (
                            <MessageCircle className="w-4 h-4" />
                          )}
                        </div>
                      )}

                      <div className="chat-widget-message-content">
                        <div className="chat-widget-message-bubble">
                          {msg.content}
                        </div>

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="chat-widget-sources">
                            {msg.sources.map((source, i) => (
                              <a
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-widget-source-chip"
                              >
                                {source.title}
                              </a>
                            ))}
                          </div>
                        )}

                        <span className="chat-widget-timestamp">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      {msg.role === 'user' && (
                        <div className="chat-widget-avatar user">
                          <span>U</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {isTyping && (
                <div className="chat-widget-message assistant">
                  <div className="chat-widget-avatar">
                    {agentAvatar ? (
                      <img src={agentAvatar} alt="AI" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="chat-widget-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </>
      )}

      {/* Ask Bar (Always Visible) */}
      <div className={cn('chat-widget-askbar', glowingBorder && 'glowing')}>
        <MessageCircle className="chat-widget-askbar-icon" strokeWidth={1.5} />
        
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="chat-widget-askbar-input"
          rows={1}
          aria-label="Chat input"
        />

        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="chat-widget-askbar-send"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
