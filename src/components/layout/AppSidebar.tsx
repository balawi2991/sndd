import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Palette, 
  MessageSquare, 
  Code, 
  Play,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Training Materials', icon: BookOpen, href: '/training' },
    { title: 'Appearance', icon: Palette, href: '/appearance' },
    { title: 'Conversations', icon: MessageSquare, href: '/conversations' },
    { title: 'Embed Code', icon: Code, href: '/embed' },
    { title: 'Try My Agent', icon: Play, href: '/try' },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mint-400 to-mint-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">MintChat</h1>
            <p className="text-xs text-gray-500">AI Chat Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    className="h-10 px-3 hover:bg-gray-100 data-[active=true]:bg-mint-50 data-[active=true]:text-mint-700"
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/settings'}
                  className="h-10 px-3 hover:bg-gray-100 data-[active=true]:bg-mint-50 data-[active=true]:text-mint-700"
                >
                  <Link to="/settings">
                    <Settings className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-mint-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-8 w-8 flex-shrink-0 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}