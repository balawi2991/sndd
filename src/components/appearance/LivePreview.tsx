import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ChatWidgetProvider, WidgetConfig } from '@/contexts/ChatWidgetContext';
import ChatWidget from '@/components/widget/ChatWidget';

interface LivePreviewProps {
  config: WidgetConfig;
}

const LivePreview: React.FC<LivePreviewProps> = ({ config }) => {
  const [previewUrl, setPreviewUrl] = useState('https://example.com');

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div className="enterprise-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Input
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 h-9 text-sm focus-calm"
          />
          <Button size="sm" variant="outline">
            Update
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        <ChatWidgetProvider initialConfig={config}>
          <div className="live-preview-canvas" style={{ minHeight: '600px', position: 'relative' }}>
            {/* Hero Section */}
            <div className="p-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-2xl">
                <div className="skeleton h-8 w-48 mb-4" />
                <div className="skeleton h-12 w-full mb-3" />
                <div className="skeleton h-12 w-3/4 mb-6" />
                <div className="skeleton h-10 w-32 rounded-lg" />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-12 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="skeleton h-32 w-full rounded-lg" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-5/6" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="skeleton h-6 w-64" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>

            {/* Widget - Container Mode */}
            <div className="live-preview__widget-slot">
              <ChatWidget containerMode={true} />
            </div>
          </div>
        </ChatWidgetProvider>
      </div>
    </div>
  );
};

export default LivePreview;