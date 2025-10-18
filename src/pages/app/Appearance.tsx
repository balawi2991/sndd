import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import AppearanceControls from '@/components/appearance/AppearanceControls';
import LivePreview from '@/components/appearance/LivePreview';
import { usePersistedConfig } from '@/hooks/usePersistedConfig';
import { useToast } from '@/hooks/use-toast';

const Appearance = () => {
  const { config, setConfig, resetConfig } = usePersistedConfig();
  const { toast } = useToast();

  const handleReset = () => {
    resetConfig();
    toast({
      title: "Settings reset",
      description: "Widget appearance has been reset to defaults.",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
            <p className="text-sm text-gray-600">Customize your chat widget</p>
          </div>
        </div>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppearanceControls config={config} setConfig={setConfig} />
            <LivePreview config={config} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appearance;