import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversation, deleteConversation, renameConversation } from '@/services/conversationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ConversationViewProps {
  conversationId: string | null;
  onDelete?: () => void;
  onRename?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, onDelete, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversation, isLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationId ? getConversation(conversationId) : null,
    enabled: !!conversationId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-stats'] });
      setIsDeleting(false);
      onDelete?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete conversation.',
        variant: 'destructive',
      });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameConversation(id, title),
    onSuccess: () => {
      toast({
        title: 'Conversation renamed',
        description: 'The conversation has been renamed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      setIsRenaming(false);
      onRename?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to rename conversation.',
        variant: 'destructive',
      });
    },
  });

  const handleRename = () => {
    if (!conversationId || !newTitle.trim()) return;
    renameMutation.mutate({ id: conversationId, title: newTitle.trim() });
  };

  const handleDelete = () => {
    if (!conversationId) return;
    deleteMutation.mutate(conversationId);
  };

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

  if (isLoading || !conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl px-6">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-32" />
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
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
    <>
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
              <DropdownMenuItem onClick={() => {
                setNewTitle(conversation.title);
                setIsRenaming(true);
              }}>
                <Edit2 className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
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
                <React.Fragment key={index}>
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
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-mint-700">AI</span>
                      </div>
                    )}
                    <div className="max-w-lg">
                      <div
                        className={`rounded-lg px-4 py-3 ${
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
                      
                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Sources: </span>
                          {message.sources.map((source, idx) => (
                            <span key={idx}>
                              {source.title}
                              {idx < message.sources!.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
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

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Enter a new title for this conversation
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Conversation title"
            className="focus-calm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRename}
              disabled={!newTitle.trim() || renameMutation.isPending}
            >
              {renameMutation.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationView;
