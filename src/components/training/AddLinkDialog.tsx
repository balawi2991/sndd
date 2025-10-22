import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { addLink } from '@/services/trainingService';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLinkDialog: React.FC<AddLinkDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      await addLink(url, title);
      toast({
        title: "Link added",
        description: "The website content has been added to your knowledge base.",
      });
      queryClient.invalidateQueries({ queryKey: ['training-materials'] });
      onOpenChange(false);
      setUrl('');
      setTitle('');
    } catch (error: any) {
      toast({
        title: "Failed to add link",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Website Link</DialogTitle>
          <DialogDescription>
            Enter a URL to crawl and train your assistant with website content
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Company Website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-calm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="focus-calm"
            />
            <p className="text-xs text-gray-500">
              Enter the URL of the page you want to add
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!url.trim() || loading}
              className="bg-mint-600 hover:bg-mint-700 text-white"
            >
              {loading ? 'Adding...' : 'Add Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkDialog;