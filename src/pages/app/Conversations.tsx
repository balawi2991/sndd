import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getConversations, getConversationStats } from '@/services/conversationService';
import ConversationList from '@/components/conversations/ConversationList';
import ConversationView from '@/components/conversations/ConversationView';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Conversations = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const { data: stats } = useQuery({
    queryKey: ['conversation-stats'],
    queryFn: getConversationStats,
  });

  const filteredConversations = conversations
    ?.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'unread' && c.unread);
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
            <p className="text-sm text-gray-600">View and manage your chat history</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-mint-50 to-mint-100 rounded-lg p-4 border border-mint-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-mint-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total Conversations</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                  <p className="text-xs text-gray-600">Unread</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                  <p className="text-xs text-gray-600">This Week</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-hidden flex">
        {/* Left Rail */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 space-y-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9 focus-calm"
              />
            </div>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">
                  All {conversations && `(${conversations.length})`}
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {stats && stats.unread > 0 && `(${stats.unread})`}
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
          <ConversationView 
            conversationId={selectedId} 
            onDelete={() => {
              setSelectedId(null);
              refetch();
            }}
            onRename={() => refetch()}
          />
        </div>
      </main>
    </div>
  );
};

export default Conversations;
