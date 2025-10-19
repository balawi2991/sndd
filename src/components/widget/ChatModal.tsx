import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
        className="mintchat-modal"
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
              {messages.map((msg, index) => (
                <div
                  key={index}
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
