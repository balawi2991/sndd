import React, { useRef, useEffect } from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useChatWidget } from '@/contexts/ChatWidgetContext';

interface AskBarProps {
  containerMode?: boolean; // true when inside preview containers
}

const AskBar: React.FC<AskBarProps> = ({ containerMode = false }) => {
  const { config, inputValue, setInputValue, isOpen, openWidget, sendMessage, isSending } = useChatWidget();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Open modal on first character
    if (value.length === 1 && !isOpen) {
      openWidget();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <div 
      className={`chat-askbar ${config.glowingBorder ? 'chat-askbar--glow' : ''}`}
      style={{
        position: containerMode ? 'absolute' : 'fixed',
        bottom: containerMode ? '16px' : 'clamp(16px, 4vh, 32px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1002,
      }}
    >
      {/* Glow effect border */}
      {config.glowingBorder && <div className="chat-askbar__glow" />}
      
      {/* Main bar content */}
      <div className="chat-askbar__content">
        {/* Icon */}
        <div className="chat-askbar__icon">
          <MessageCircle 
            className="w-5 h-5" 
            style={{ color: config.primaryColor }}
            strokeWidth={1.5}
          />
        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={config.placeholder}
          className="chat-askbar__input"
          rows={1}
          aria-label="Chat input"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending}
          className="chat-askbar__send"
          style={{
            backgroundColor: inputValue.trim() && !isSending ? config.primaryColor : undefined,
          }}
          aria-label="Send message"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AskBar;
