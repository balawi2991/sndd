import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWidgetProvider } from '@/contexts/ChatWidgetContext';
import ChatWidget from '@/components/widget/ChatWidget';

const DemoPage = () => {
  // Default config for Demo
  const defaultConfig = {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <Button variant="ghost" asChild className="gap-2">
          <Link to="/embed">
            <ArrowLeft className="w-4 h-4" />
            Back to Embed Code
          </Link>
        </Button>
      </div>

      {/* Demo Content */}
      <ChatWidgetProvider initialConfig={defaultConfig}>
        <div className="live-preview-canvas border-0 rounded-none" style={{ minHeight: 'calc(100vh - 73px)', position: 'relative' }}>
        {/* Hero Section */}
        <div className="px-6 py-20 bg-gradient-to-br from-mint-50 via-white to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <div className="skeleton h-12 w-96 mb-6" />
              <div className="skeleton h-8 w-full mb-4" />
              <div className="skeleton h-8 w-3/4 mb-8" />
              <div className="flex gap-4">
                <div className="skeleton h-14 w-40 rounded-lg" />
                <div className="skeleton h-14 w-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="skeleton h-10 w-96 mx-auto mb-4" />
              <div className="skeleton h-6 w-2/3 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="skeleton h-48 w-full rounded-xl" />
                  <div className="skeleton h-6 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="skeleton h-10 w-3/4" />
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-4/5" />
                <div className="skeleton h-12 w-36 rounded-lg mt-6" />
              </div>
              <div className="skeleton h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="skeleton h-12 w-2/3 mx-auto mb-6" />
            <div className="skeleton h-6 w-full max-w-2xl mx-auto mb-8" />
            <div className="skeleton h-14 w-48 mx-auto rounded-lg" />
          </div>
        </div>

        {/* Widget Slot */}
        <div className="live-preview__widget-slot">
          <ChatWidget containerMode={true} />
        </div>
      </div>
      </ChatWidgetProvider>
    </div>
  );
};

export default DemoPage;