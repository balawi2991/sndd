import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversation } from '@/services/conversationService';
import { Button } from '@/components/ui/button';
import { MoreVertical, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationViewProps {
  conversationId: string | null;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId }) => {
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationId ? getConversation(conversationId) : null,
    enabled: !!conversationId,
  });

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-600">Choose a conversation from the list to view details</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  let currentDate = '';

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{conversation.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(conversation.lastActivity).toLocaleDateString()} at{' '}
            {new Date(conversation.lastActivity).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {conversation.messages.map((message, index) => {
            const messageDate = formatDate(message.timestamp);
            const showDateDivider = messageDate !== currentDate;
            if (showDateDivider) {
              currentDate = messageDate;
            }

            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {messageDate}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}
                <div
                  className={`flex gap-3 animate-slide-up ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-mint-700">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-lg rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-mint-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-mint-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">U</span>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationView;