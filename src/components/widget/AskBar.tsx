import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface AskBarProps {
  onSend: (message: string) => void;
  onFocus: () => void;
  placeholder?: string;
  primaryColor?: string;
  glowingBorder?: boolean;
  disabled?: boolean;
  containerType?: 'viewport' | 'preview';
}

const AskBar: React.FC<AskBarProps> = ({
  onSend,
  onFocus,
  placeholder = 'Ask me anything...',
  primaryColor = '#17B26A',
  glowingBorder = true,
  disabled = false,
  containerType = 'viewport',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Open modal on first character
    if (value.length === 1 && value.trim()) {
      onFocus();
      // Re-focus textarea after modal opens
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  // Auto-focus when modal opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="mintchat-askbar-wrapper">
      <form onSubmit={handleSubmit} className="mintchat-askbar-form">
        <div 
          className={`mintchat-askbar ${glowingBorder ? 'mintchat-askbar--glow' : ''} ${containerType === 'preview' ? 'mintchat-askbar--preview' : ''}`}
          style={{
            '--primary-color': primaryColor,
          } as React.CSSProperties}
        >
          <button
            type="button"
            className="mintchat-askbar__icon"
            aria-label="Chat"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="mintchat-askbar__input"
            rows={1}
            aria-label="Type your message"
          />
          
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="mintchat-askbar__send"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskBar;
