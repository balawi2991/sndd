import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTrainingMaterials } from '@/services/trainingService';
import TrainingTable from '@/components/training/TrainingTable';
import AddFileDialog from '@/components/training/AddFileDialog';
import AddLinkDialog from '@/components/training/AddLinkDialog';
import AddTextDialog from '@/components/training/AddTextDialog';

const TrainingMaterials = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTextDialog, setShowTextDialog] = useState(false);

  const { data: materials, isLoading } = useQuery({
    queryKey: ['training-materials', activeTab],
    queryFn: () => getTrainingMaterials(activeTab),
  });

  const handleAddClick = () => {
    if (activeTab === 'files') setShowFileDialog(true);
    else if (activeTab === 'links') setShowLinkDialog(true);
    else if (activeTab === 'text') setShowTextDialog(true);
    else setShowFileDialog(true); // Default to file for 'all'
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Training Materials</h1>
            <p className="text-sm text-gray-600">Manage your knowledge base</p>
          </div>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-mint-600 hover:bg-mint-700 text-white focus-calm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-white">
                Files
              </TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-white">
                Links
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-white">
                Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <TrainingTable materials={materials} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddFileDialog open={showFileDialog} onOpenChange={setShowFileDialog} />
      <AddLinkDialog open={showLinkDialog} onOpenChange={setShowLinkDialog} />
      <AddTextDialog open={showTextDialog} onOpenChange={setShowTextDialog} />
    </div>
  );
};

export default TrainingMaterials;