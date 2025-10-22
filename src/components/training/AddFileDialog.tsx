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
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { addFile } from '@/services/trainingService';

interface AddFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFileDialog: React.FC<AddFileDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setLoading(true);
    try {
      await addFile(file, title);
      toast({
        title: "File uploaded",
        description: "Your file has been added to the knowledge base.",
      });
      queryClient.invalidateQueries({ queryKey: ['training-materials'] });
      onOpenChange(false);
      setFile(null);
      setTitle('');
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
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
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload PDF, DOCX, or Markdown files to train your assistant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Product Documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="focus-calm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Select file</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-mint-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Input
                id="file"
                type="file"
                accept=".pdf,.docx,.md,.txt"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    if (!title) {
                      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
                    }
                  }
                }}
                className="hidden"
              />
              <Label htmlFor="file" className="cursor-pointer">
                <span className="text-sm text-mint-600 font-medium hover:text-mint-700">
                  Choose file
                </span>
                <span className="text-sm text-gray-600"> or drag and drop</span>
              </Label>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX, MD, TXT up to 1MB</p>
            </div>
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
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
              disabled={!file || !title.trim() || loading}
              className="bg-mint-600 hover:bg-mint-700 text-white"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileDialog;