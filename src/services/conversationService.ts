export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  lastActivity: Date;
  unread: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Product Inquiry',
    preview: 'Hi, I have a question about your pricing...',
    lastActivity: new Date('2024-01-15T14:30:00'),
    unread: true,
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'Hi, I have a question about your pricing plans.',
        timestamp: new Date('2024-01-15T14:30:00'),
      },
      {
        id: '1-2',
        role: 'assistant',
        content: 'Hello! I\'d be happy to help you with information about our pricing. We offer three main plans: Starter, Professional, and Enterprise. What would you like to know?',
        timestamp: new Date('2024-01-15T14:30:15'),
      },
      {
        id: '1-3',
        role: 'user',
        content: 'What\'s included in the Professional plan?',
        timestamp: new Date('2024-01-15T14:31:00'),
      },
      {
        id: '1-4',
        role: 'assistant',
        content: 'The Professional plan includes unlimited conversations, advanced analytics, custom branding, priority support, and API access. It\'s perfect for growing businesses.',
        timestamp: new Date('2024-01-15T14:31:20'),
      },
    ],
  },
  {
    id: '2',
    title: 'Technical Support',
    preview: 'I\'m having trouble integrating the widget...',
    lastActivity: new Date('2024-01-14T10:15:00'),
    unread: false,
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'I\'m having trouble integrating the widget into my website.',
        timestamp: new Date('2024-01-14T10:15:00'),
      },
      {
        id: '2-2',
        role: 'assistant',
        content: 'I can help you with that! Could you tell me which platform you\'re using? WordPress, custom HTML, or something else?',
        timestamp: new Date('2024-01-14T10:15:30'),
      },
    ],
  },
  {
    id: '3',
    title: 'Feature Request',
    preview: 'Would love to see multi-language support...',
    lastActivity: new Date('2024-01-13T16:45:00'),
    unread: false,
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'Would love to see multi-language support in the future!',
        timestamp: new Date('2024-01-13T16:45:00'),
      },
      {
        id: '3-2',
        role: 'assistant',
        content: 'Thank you for the feedback! Multi-language support is on our roadmap. We\'re planning to add it in Q2 2024.',
        timestamp: new Date('2024-01-13T16:45:45'),
      },
    ],
  },
];

export const getConversations = async (): Promise<Conversation[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockConversations;
};

export const getConversation = async (id: string): Promise<Conversation | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockConversations.find(c => c.id === id);
};