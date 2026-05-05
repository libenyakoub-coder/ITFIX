import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { uploadScreenshot } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { TicketCategory } from '@/types/types';

interface CreateTicketFormProps {
  onSuccess?: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const { user, employee } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as TicketCategory | '',
    office_location: employee?.office_location || '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setScreenshot(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejections) => {
      if (rejections[0]?.errors[0]?.code === 'file-too-large') {
        toast.error('File size must be less than 1MB');
      } else {
        toast.error('Invalid file type. Please upload an image.');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let screenshotUrl: string | null = null;

      if (screenshot) {
        try {
          screenshotUrl = await uploadScreenshot(screenshot);
        } catch (uploadError) {
          console.warn('Screenshot upload failed, submitting ticket without screenshot:', uploadError);
          toast.warning('Screenshot upload failed. Submitting ticket without screenshot.');
        }
      }

      const insertPayload = {
        employee_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        office_location: formData.office_location,
        screenshot_url: screenshotUrl,
        status: 'pending',
      };

      console.log('Submitting ticket:', insertPayload);

      const { data: insertData, error } = await supabase.from('tickets').insert(insertPayload).select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database error: ${error.message} (code: ${error.code})`);
      }

      console.log('Ticket created successfully:', insertData);
      toast.success('Ticket created successfully');
      setFormData({
        title: '',
        description: '',
        category: '',
        office_location: employee?.office_location || '',
      });
      setScreenshot(null);
      onSuccess?.();
    } catch (error) {
      console.error('Ticket creation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Create New Ticket</CardTitle>
        <CardDescription className="text-pretty">
          Submit a new IT support request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="px-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the problem"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="px-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as TicketCategory })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_location">Office Location</Label>
              <Input
                id="office_location"
                placeholder="Building A, Floor 3"
                value={formData.office_location}
                onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                required
                className="px-3"
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshot (Optional)</Label>
              {!screenshot ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive ? 'Drop the file here' : 'Drag and drop an image, or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max file size: 1MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{screenshot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(screenshot.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setScreenshot(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
