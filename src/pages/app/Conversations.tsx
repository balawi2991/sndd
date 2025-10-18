import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@/services/conversationService';
import ConversationList from '@/components/conversations/ConversationList';
import ConversationView from '@/components/conversations/ConversationView';

const Conversations = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const filteredConversations = conversations?.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
          <p className="text-sm text-gray-600">View your chat history</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        {/* Left Rail */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9 focus-calm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ConversationList
              conversations={filteredConversations}
              isLoading={isLoading}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* Right Pane */}
        <div className="flex-1 bg-gray-50">
          <ConversationView conversationId={selectedId} />
        </div>
      </main>
    </div>
  );
};

export default Conversations;