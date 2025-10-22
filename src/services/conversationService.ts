import api from '@/lib/api';

export interface Source {
  title: string;
  url?: string;
  materialId?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: string | Date;
}

export interface ConversationListItem {
  id: string;
  title: string;
  preview: string;
  lastActivity: string | Date;
  unread: boolean;
  messageCount: number;
}

export interface ConversationDetail {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: string | Date;
}

export interface ConversationStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
}

// Get all conversations
export const getConversations = async (): Promise<ConversationListItem[]> => {
  const response = await api.get('/conversations');
  return response.data;
};

// Get single conversation
export const getConversation = async (id: string): Promise<ConversationDetail> => {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
};

// Delete conversation
export const deleteConversation = async (id: string): Promise<void> => {
  await api.delete(`/conversations/${id}`);
};

// Rename conversation
export const renameConversation = async (id: string, title: string): Promise<void> => {
  await api.patch(`/conversations/${id}`, { title });
};

// Get conversation statistics
export const getConversationStats = async (): Promise<ConversationStats> => {
  const conversations = await getConversations();
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  return {
    total: conversations.length,
    unread: conversations.filter(c => c.unread).length,
    today: conversations.filter(c => new Date(c.lastActivity) >= todayStart).length,
    thisWeek: conversations.filter(c => new Date(c.lastActivity) >= weekStart).length,
  };
};