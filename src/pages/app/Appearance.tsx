import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AppearanceControls from '@/components/appearance/AppearanceControls';
import { ChatWidget, WidgetConfig } from '@/components/widget/ChatWidget';

const Appearance = () => {
  const [config, setConfig] = useState<WidgetConfig>({
    primaryColor: '#17B26A',
    glowingBorder: true,
    title: 'Chat with us',
    placeholder: 'Ask me anything...',
    agentAvatar: '',
    suggestedQuestions: [
      'How can I get started?',
      'What are your pricing plans?',
      'Do you offer support?',
    ],
  });

  // Mock messages for preview
  const mockMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
          <p className="text-sm text-gray-600">Customize your chat widget</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppearanceControls config={config} setConfig={setConfig} />
            
            {/* Live Preview */}
            <div className="enterprise-card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Live Preview</h3>
              <div className="live-preview-canvas relative bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
                {/* Skeleton Content */}
                <div className="p-8 space-y-6">
                  <div className="skeleton h-8 w-64" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="skeleton h-32 rounded-lg" />
                    <div className="skeleton h-32 rounded-lg" />
                  </div>
                </div>

                {/* Widget Slot */}
                <div className="live-preview__widget-slot">
                  <ChatWidget
                    config={config}
                    messages={mockMessages}
                    containerAware={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appearance;