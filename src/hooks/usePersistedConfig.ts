import { useState, useEffect } from 'react';
import { WidgetConfig } from '@/contexts/ChatWidgetContext';

const STORAGE_KEY = 'mintchat_widget_config';

const defaultConfig: WidgetConfig = {
  logo: '',
  primaryColor: '#17B26A',
  glowingBorder: true,
  avatar: '',
  showFloatingAvatar: true,
  title: 'Chat with us',
  placeholder: 'Ask me anything...',
  suggestedQuestions: [
    'How can I get started?',
    'What are your pricing plans?',
    'Do you offer support?',
  ],
};

export const usePersistedConfig = () => {
  const [config, setConfig] = useState<WidgetConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load config from localStorage:', error);
    }
    return defaultConfig;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
    }
  }, [config]);

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { config, setConfig, resetConfig };
};
