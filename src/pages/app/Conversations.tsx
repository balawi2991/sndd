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
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
            <p className="text-sm text-gray-600">View and manage your chat history</p>
          </div>
        </div>

        {/* Stats Cards - Smaller */}
        {stats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="enterprise-card p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-medium">Total</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
            </div>

            <div className="enterprise-card p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-medium">Unread</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{stats.unread}</div>
            </div>

            <div className="enterprise-card p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-medium">Today</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{stats.today}</div>
            </div>

            <div className="enterprise-card p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-medium">This Week</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{stats.thisWeek}</div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with proper flex */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
          {/* Search and Filters - Fixed */}
          <div className="flex-shrink-0 p-4 space-y-3 border-b border-gray-200">
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
                <TabsTrigger value="all" className="text-xs">
                  All {conversations && `(${conversations.length})`}
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Unread {stats && stats.unread > 0 && `(${stats.unread})`}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={filteredConversations}
              isLoading={isLoading}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* Right Panel - Conversation View */}
        <div className="flex-1 bg-gray-50 overflow-hidden">
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
