import React, { useState } from 'react';
import { TrainingMaterial } from '@/services/trainingService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Link as LinkIcon, Type, MoreVertical, RefreshCw, Trash2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { retrainMaterial, deleteMaterial } from '@/services/trainingService';

interface TrainingTableProps {
  materials?: TrainingMaterial[];
  isLoading: boolean;
}

const TrainingTable: React.FC<TrainingTableProps> = ({ materials, isLoading }) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileText className="w-4 h-4" strokeWidth={1.5} />;
      case 'link': return <LinkIcon className="w-4 h-4" strokeWidth={1.5} />;
      case 'text': return <Type className="w-4 h-4" strokeWidth={1.5} />;
      default: return null;
    }
  };

  const handleRetrain = async (id: string) => {
    await retrainMaterial(id);
    toast({ title: "Training started", description: "Material is being retrained." });
  };

  const handleDelete = async (id: string) => {
    await deleteMaterial(id);
    toast({ title: "Material deleted", description: "Training material has been removed." });
  };

  const handleBulkRetrain = async () => {
    console.log('Bulk retraining:', Array.from(selected));
    toast({ title: "Bulk training started", description: `Retraining ${selected.size} items.` });
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const untrainedCount = materials?.filter(m => m.status === 'untrained').length || 0;

  if (isLoading) {
    return (
      <div className="enterprise-card">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton w-4 h-4" />
              <div className="skeleton w-8 h-8 rounded" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="enterprise-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No training materials yet</h3>
        <p className="text-gray-600 mb-6">Add files, links, or text to train your AI assistant</p>
        <Button className="bg-mint-600 hover:bg-mint-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="enterprise-card p-4 flex items-center justify-between animate-slide-up">
          <span className="text-sm text-gray-600">
            {selected.size} item{selected.size > 1 ? 's' : ''} selected
          </span>
          <Button
            onClick={handleBulkRetrain}
            size="sm"
            className="bg-mint-600 hover:bg-mint-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retrain Selected
          </Button>
        </div>
      )}

      <div className="enterprise-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <Checkbox
                    checked={selected.size === materials.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(new Set(materials.map(m => m.id)));
                      } else {
                        setSelected(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title / Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Characters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Trained
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selected.has(material.id)}
                      onCheckedChange={() => toggleSelect(material.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                      {getTypeIcon(material.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{material.title}</div>
                      {material.source && (
                        <div className="text-sm text-gray-500">{material.source}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {material.characters.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={material.status === 'trained' ? 'default' : 'secondary'}
                      className={material.status === 'trained' ? 'bg-mint-100 text-mint-700 hover:bg-mint-100' : ''}
                    >
                      {material.status === 'trained' ? 'Trained' : 'Untrained'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {material.lastTrained
                      ? new Date(material.lastTrained).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRetrain(material.id)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retrain
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(material.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainingTable;