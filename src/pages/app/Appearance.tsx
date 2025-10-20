import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AppearanceControls from '@/components/appearance/AppearanceControls';
import LivePreview from '@/components/appearance/LivePreview';
import { appearanceAPI } from '@/lib/api';

const Appearance = () => {
  const [config, setConfig] = useState({
    logo: '',
    primaryColor: '#17B26A',
    position: 'center-bottom',
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
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load appearance settings
    appearanceAPI.get()
      .then(({ data }) => {
        setConfig({
          logo: data.logo || '',
          primaryColor: data.primaryColor || '#17B26A',
          position: 'center-bottom',
          glowingBorder: data.glowingBorder ?? true,
          avatar: data.avatar || '',
          showFloatingAvatar: data.showFloatingAvatar ?? true,
          title: data.title || 'Chat with us',
          placeholder: data.placeholder || 'Ask me anything...',
          suggestedQuestions: data.suggestedQuestions || [],
        });
      })
      .catch((error) => {
        console.error('Failed to load appearance settings:', error);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await appearanceAPI.update(config);
      toast.success('Appearance settings saved');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
            <p className="text-sm text-gray-600">Customize your chat widget</p>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppearanceControls config={config} setConfig={handleConfigChange} />
            <LivePreview config={config} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appearance;