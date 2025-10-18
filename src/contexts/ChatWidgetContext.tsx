import React, { createContext, useContext, useState, useCallback } from 'react';
import { chatAPI } from '@/services/api/chat.api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
}

export interface WidgetConfig {
  logo?: string;
  primaryColor: string;
  glowingBorder: boolean;
  avatar?: string;
  showFloatingAvatar: boolean;
  title: string;
  placeholder: string;
  suggestedQuestions: string[];
}

interface ChatWidgetContextType {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  isSending: boolean;
  error: { code: string; message: string; retry?: () => void } | null;
  config: WidgetConfig;
  inputValue: string;
  conversationId: string | null;
  setInputValue: (value: string) => void;
  openWidget: () => void;
  closeWidget: () => void;
  sendMessage: (content: string) => void;
  setConfig: (config: WidgetConfig) => void;
  clearError: () => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | null>(null);

const defaultConfig: WidgetConfig = {
  primaryColor: '#17B26A',
  glowingBorder: true,
  showFloatingAvatar: true,
  title: 'Chat with us',
  placeholder: 'Ask me anything...',
  suggestedQuestions: [
    'How can I get started?',
    'What are your pricing plans?',
    'Do you offer support?',
  ],
};

// Mock AI responses for demo
const mockResponses = [
  "I'd be happy to help you with that! Our platform makes it easy to create and customize your AI assistant in just a few minutes.",
  "Great question! We offer three pricing tiers: Starter ($29/mo), Professional ($79/mo), and Enterprise (custom pricing). Each plan includes different features and usage limits.",
  "Absolutely! We provide 24/7 support via chat, email, and our comprehensive documentation. Premium plans also include priority support and dedicated account managers.",
  "That's a common question. You can integrate our widget into any website by simply adding a single line of code before the closing </body> tag. No technical expertise required!",
  "Our AI assistant can be trained on your own content including documents, website pages, and custom text. The more you train it, the better it becomes at answering your specific questions.",
];

export const ChatWidgetProvider: React.FC<{ children: React.ReactNode; initialConfig?: Partial<WidgetConfig> }> = ({ 
  children, 
  initialConfig 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<{ code: string; message: string; retry?: () => void } | null>(null);
  const [config, setConfig] = useState<WidgetConfig>({ ...defaultConfig, ...initialConfig });
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Update config when initialConfig changes (for live preview)
  React.useEffect(() => {
    if (initialConfig) {
      setConfig(prev => ({ ...prev, ...initialConfig }));
    }
  }, [initialConfig]);

  const openWidget = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Call real API
      const response = await chatAPI.sendMessage(content.trim(), conversationId || undefined);

      if (response.success && response.data) {
        // Add AI response
        const assistantMessage: Message = {
          id: response.data.messageId,
          role: 'assistant',
          content: response.data.answer,
          timestamp: new Date(response.data.timestamp),
          sources: response.data.sources.map(s => ({
            title: s.title,
            url: s.url || '#'
          }))
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationId(response.data.conversationId);
      } else {
        // Handle error
        throw new Error(response.error?.message || 'Failed to send message');
      }

    } catch (err: any) {
      console.error('Send message error:', err);
      
      // Set error with retry function
      setError({
        code: err.code || 'NETWORK_ERROR',
        message: err.message || 'Failed to send message. Please try again.',
        retry: () => sendMessage(content)
      });

      // Remove the user message that failed
      setMessages(prev => prev.slice(0, -1));
      // Restore input value
      setInputValue(content);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  }, [isSending, conversationId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatWidgetContext.Provider
      value={{
        isOpen,
        messages,
        isTyping,
        isSending,
        error,
        config,
        inputValue,
        conversationId,
        setInputValue,
        openWidget,
        closeWidget,
        sendMessage,
        setConfig,
        clearError,
      }}
    >
      {children}
    </ChatWidgetContext.Provider>
  );
};

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error('useChatWidget must be used within ChatWidgetProvider');
  }
  return context;
};
