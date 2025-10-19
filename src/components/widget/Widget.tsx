import React, { useState } from 'react';
import AskBar from './AskBar';
import ChatModal from './ChatModal';
import { chatAPI } from '@/lib/api';
import { toast } from 'sonner';

interface WidgetConfig {
  logo?: string;
  primaryColor?: string;
  glowingBorder?: boolean;
  avatar?: string;
  showFloatingAvatar?: boolean;
  title?: string;
  placeholder?: string;
  suggestedQuestions?: string[];
}

interface WidgetProps {
  config?: WidgetConfig;
  conversationId?: string;
  onConversationCreate?: (id: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url?: string }>;
  timestamp: Date;
}

const Widget: React.FC<WidgetProps> = ({
  config = {},
  conversationId,
  onConversationCreate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { data } = await chatAPI.sendMessage(message, currentConversationId);
      
      // Update conversation ID if new
      if (!currentConversationId && data.conversationId) {
        setCurrentConversationId(data.conversationId);
        onConversationCreate?.(data.conversationId);
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message.content,
        sources: data.message.sources,
        timestamp: new Date(data.message.timestamp),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="mintchat-widget">
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messages={messages}
        title={config.title}
        logo={config.logo}
        avatar={config.avatar}
        showFloatingAvatar={config.showFloatingAvatar}
        primaryColor={config.primaryColor}
        suggestedQuestions={config.suggestedQuestions}
        onQuestionClick={handleQuestionClick}
        isTyping={isTyping}
      />
      
      <AskBar
        onSend={handleSendMessage}
        onFocus={() => setIsModalOpen(true)}
        placeholder={config.placeholder}
        primaryColor={config.primaryColor}
        glowingBorder={config.glowingBorder}
        disabled={isTyping}
      />
    </div>
  );
};

export default Widget;
