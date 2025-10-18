import React from 'react';
import { Conversation } from '@/services/conversationService';
import { Badge } from '@/components/ui/badge';

interface ConversationListProps {
  conversations?: Conversation[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedId,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedId === conversation.id ? 'bg-mint-50' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate flex-1">
              {conversation.title}
            </h3>
            {conversation.unread && (
              <Badge className="ml-2 bg-mint-600 hover:bg-mint-600 flex-shrink-0">New</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">{conversation.preview}</p>
          <p className="text-xs text-gray-500">
            {new Date(conversation.lastActivity).toLocaleDateString()} at{' '}
            {new Date(conversation.lastActivity).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </button>
      ))}
    </div>
  );
};

export default ConversationList;