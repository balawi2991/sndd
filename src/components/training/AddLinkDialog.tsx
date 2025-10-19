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
import { addLink } from '@/services/trainingService';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLinkDialog: React.FC<AddLinkDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      await addLink(url);
      toast({
        title: "Link added",
        description: "The website content will be crawled and trained.",
      });
      onOpenChange(false);
      setUrl('');
    } catch (error: any) {
      toast({
        title: "Failed to add link",
        description: error?.message || "Please check the URL and try again.",
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
              We'll crawl the page and extract relevant content
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