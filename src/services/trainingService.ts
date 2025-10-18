export interface TrainingMaterial {
  id: string;
  type: 'file' | 'link' | 'text';
  title: string;
  source?: string;
  characters: number;
  status: 'trained' | 'untrained';
  lastTrained?: Date;
}

const mockMaterials: TrainingMaterial[] = [
  {
    id: '1',
    type: 'file',
    title: 'Product Documentation.pdf',
    source: 'product-docs.pdf',
    characters: 45230,
    status: 'trained',
    lastTrained: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'link',
    title: 'Company Website',
    source: 'https://example.com',
    characters: 12450,
    status: 'trained',
    lastTrained: new Date('2024-01-14'),
  },
  {
    id: '3',
    type: 'text',
    title: 'FAQ Responses',
    characters: 8920,
    status: 'untrained',
  },
  {
    id: '4',
    type: 'file',
    title: 'User Guide.docx',
    source: 'user-guide.docx',
    characters: 32100,
    status: 'untrained',
  },
  {
    id: '5',
    type: 'link',
    title: 'Help Center',
    source: 'https://help.example.com',
    characters: 28340,
    status: 'trained',
    lastTrained: new Date('2024-01-13'),
  },
];

export const getTrainingMaterials = async (filter: string): Promise<TrainingMaterial[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (filter === 'all') return mockMaterials;
  return mockMaterials.filter(m => m.type === filter);
};

export const retrainMaterial = async (id: string): Promise<void> => {
  console.log('Retraining material:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const deleteMaterial = async (id: string): Promise<void> => {
  console.log('Deleting material:', id);
  await new Promise(resolve => setTimeout(resolve, 300));
};

export const addFile = async (files: FileList): Promise<void> => {
  console.log('Adding files:', files);
  await new Promise(resolve => setTimeout(resolve, 800));
};

export const addLink = async (url: string): Promise<void> => {
  console.log('Adding link:', url);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const addText = async (title: string, content: string): Promise<void> => {
  console.log('Adding text:', { title, content });
  await new Promise(resolve => setTimeout(resolve, 500));
};