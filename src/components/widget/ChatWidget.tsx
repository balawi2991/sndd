import React, { useEffect } from 'react';
import AskBar from './AskBar';
import ChatModal from './ChatModal';
import { useChatWidget } from '@/contexts/ChatWidgetContext';

interface ChatWidgetProps {
  containerMode?: boolean; // true when inside .live-preview-canvas
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ containerMode = false }) => {
  const { sendMessage, setInputValue } = useChatWidget();

  // Listen for suggested question clicks
  useEffect(() => {
    const handleSuggestedQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setInputValue(customEvent.detail);
      sendMessage(customEvent.detail);
    };

    window.addEventListener('sendSuggestedQuestion', handleSuggestedQuestion);
    return () => window.removeEventListener('sendSuggestedQuestion', handleSuggestedQuestion);
  }, [sendMessage, setInputValue]);

  return (
    <>
      <ChatModal containerMode={containerMode} />
      <AskBar containerMode={containerMode} />
    </>
  );
};

export default ChatWidget;
