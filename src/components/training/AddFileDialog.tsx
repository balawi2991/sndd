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
import { addFile } from '@/services/trainingService';

interface AddFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFileDialog: React.FC<AddFileDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      await addFile(files);
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) added successfully.`,
      });
      onOpenChange(false);
      setFiles(null);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.message || "Something went wrong. Please try again.",
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
            <Label htmlFor="files">Select files</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-mint-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Input
                id="files"
                type="file"
                multiple
                accept=".pdf,.docx,.md"
                onChange={(e) => setFiles(e.target.files)}
                className="hidden"
              />
              <Label htmlFor="files" className="cursor-pointer">
                <span className="text-sm text-mint-600 font-medium hover:text-mint-700">
                  Choose files
                </span>
                <span className="text-sm text-gray-600"> or drag and drop</span>
              </Label>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX, MD up to 10MB each</p>
            </div>
            {files && files.length > 0 && (
              <p className="text-sm text-gray-600">
                {files.length} file(s) selected
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
              disabled={!files || files.length === 0 || loading}
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