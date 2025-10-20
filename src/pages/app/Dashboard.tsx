import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  BookOpen, 
  Palette, 
  Code, 
  MessageSquare, 
  Play,
  FileText,
  Link as LinkIcon,
  Type,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/dashboardService';
import { usageAPI } from '@/lib/api';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      const { data } = await usageAPI.getStats();
      return data;
    },
  });

  const quickActions = [
    { title: 'Training Materials', icon: BookOpen, href: '/training', description: 'Manage your knowledge base' },
    { title: 'Appearance', icon: Palette, href: '/appearance', description: 'Customize your chat widget' },
    { title: 'Embed Code', icon: Code, href: '/embed', description: 'Add chat to your website' },
    { title: 'Conversations', icon: MessageSquare, href: '/conversations', description: 'View chat history' },
    { title: 'Try My Agent', icon: Play, href: '/try', description: 'Test your assistant' },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your AI assistant</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Usage Stats */}
          {usage && (
            <div className="enterprise-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Usage This Month</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {usage.plan.toUpperCase()}
                </span>
              </div>

              {/* Messages Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Messages</span>
                  <span className="font-medium text-gray-900">
                    {usage.usage.messages.used} / {usage.usage.messages.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      usage.usage.messages.percent >= 90
                        ? 'bg-red-500'
                        : usage.usage.messages.percent >= 70
                        ? 'bg-yellow-500'
                        : 'bg-mint-500'
                    }`}
                    style={{ width: `${Math.min(usage.usage.messages.percent, 100)}%` }}
                  />
                </div>
                {usage.usage.messages.percent >= 80 && (
                  <p className="text-xs text-yellow-600">
                    ⚠️ You're approaching your monthly limit
                  </p>
                )}
              </div>

              {/* Tokens Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tokens</span>
                  <span className="font-medium text-gray-900">
                    {usage.usage.tokens.used.toLocaleString()} / {usage.usage.tokens.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      usage.usage.tokens.percent >= 90
                        ? 'bg-red-500'
                        : usage.usage.tokens.percent >= 70
                        ? 'bg-yellow-500'
                        : 'bg-mint-500'
                    }`}
                    style={{ width: `${Math.min(usage.usage.tokens.percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Reset Date */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Resets on {new Date(usage.nextReset).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="enterprise-card p-6 space-y-3">
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-8 w-20" />
                    <div className="skeleton h-3 w-full" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="enterprise-card p-6 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Knowledge Items</span>
                  </div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {stats?.totalKnowledge || 0}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{stats?.files || 0} Files</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      <span>{stats?.links || 0} Links</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Type className="w-3 h-3" />
                      <span>{stats?.texts || 0} Text</span>
                    </div>
                  </div>
                </div>

                <div className="enterprise-card p-6 space-y-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-4 h-4 rounded-full bg-mint-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-mint-600" />
                    </div>
                    <span className="text-sm font-medium">Training Status</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-gray-900">
                      {stats?.trained || 0}
                    </span>
                    <span className="text-lg text-gray-500">/ {stats?.totalKnowledge || 0}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats?.untrained || 0} items need training
                  </div>
                </div>

                <div className="enterprise-card p-6 space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Palette className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Appearance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: stats?.primaryColor || '#17B26A' }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {stats?.primaryColor || '#17B26A'}
                      </div>
                      <div className="text-xs text-gray-500">Primary color</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats?.suggestedQuestions || 0} suggested questions
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="enterprise-card p-6 hover:shadow-md transition-all duration-150 group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-mint-50 flex items-center justify-center flex-shrink-0 group-hover:bg-mint-100 transition-colors">
                      <action.icon className="w-5 h-5 text-mint-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;