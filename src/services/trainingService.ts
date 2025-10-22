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
  const token = localStorage.getItem('token');
  const type = filter === 'all' ? 'all' : filter;
  
  const response = await fetch(`/api/training?type=${type}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch training materials');
  }

  const data = await response.json();
  return data.map((item: any) => ({
    id: item._id,
    type: item.type,
    title: item.title,
    source: item.source,
    characters: item.characters,
    status: item.status,
    lastTrained: item.lastTrained ? new Date(item.lastTrained) : undefined,
  }));
};

export const retrainMaterial = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/training/${id}/retrain`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to retrain material');
  }
};

export const deleteMaterial = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/training/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete material');
  }
};

export const addFile = async (file: File, title: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  // Read file content
  const content = await file.text();
  
  const response = await fetch('/api/training/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add file');
  }
};

export const addLink = async (url: string, title?: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  // Fetch content from URL (this should be done on backend in production)
  // For now, we'll send a placeholder
  const content = `Content from ${url}`;
  
  const response = await fetch('/api/training/link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      url,
      title: title || url,
      content,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add link');
  }
};

export const addText = async (title: string, content: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/training/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add text');
  }
};