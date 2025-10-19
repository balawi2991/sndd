import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChatWidget, WidgetMessage } from '@/components/widget/ChatWidget';
import { v4 as uuidv4 } from 'uuid';

const TryMyAgent = () => {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: WidgetMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiMessage: WidgetMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: 'This is a demo response. Connect your training materials and DeepSeek API to get real AI responses!',
      sources: [
        { title: 'Demo Source', url: '#' },
      ],
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Try My Agent</h1>
          <p className="text-sm text-gray-600">Test your AI assistant</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Browser-like Frame */}
          <div className="enterprise-card overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded px-3 py-1.5 text-sm text-gray-600 border border-gray-200">
                  https://yourwebsite.com
                </div>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="live-preview-canvas relative" style={{ minHeight: '70vh' }}>
              {/* Hero Section */}
              <div className="p-16 bg-gradient-to-br from-mint-50 to-white">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="skeleton h-10 w-96 mx-auto mb-4" />
                  <div className="skeleton h-6 w-full max-w-2xl mx-auto mb-3" />
                  <div className="skeleton h-6 w-3/4 mx-auto mb-8" />
                  <div className="flex gap-3 justify-center">
                    <div className="skeleton h-12 w-32 rounded-lg" />
                    <div className="skeleton h-12 w-32 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-16">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-3 gap-8 mb-12">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="skeleton h-40 w-full rounded-lg" />
                        <div className="skeleton h-5 w-3/4" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-5/6" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="skeleton h-8 w-64" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                </div>
              </div>

              {/* Widget Slot */}
              <div className="live-preview__widget-slot">
                <ChatWidget
                  config={{
                    primaryColor: '#17B26A',
                    glowingBorder: true,
                    title: 'Chat with us',
                    placeholder: 'Ask me anything...',
                    suggestedQuestions: [
                      'How can I get started?',
                      'What are your pricing plans?',
                      'Do you offer support?',
                    ],
                  }}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  containerAware={true}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TryMyAgent;