import { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { TicketCategory } from '@/types/types';

interface TransferTicketDialogProps {
  ticketId: string;
  currentCategory: TicketCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransferTicketDialog({
  ticketId,
  currentCategory,
  open,
  onOpenChange,
  onSuccess,
}: TransferTicketDialogProps) {
  const [category, setCategory] = useState<TicketCategory>(currentCategory);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!comment.trim()) {
      toast.error('Please add a comment explaining the transfer');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          category,
          status: 'transferred',
          technician_id: null,
          transfer_comment: comment,
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket transferred successfully');
      setComment('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to transfer ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-balance">Transfer Ticket</DialogTitle>
          <DialogDescription className="text-pretty">
            Transfer this ticket to a different category with a comment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="transfer-category">New Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
              <SelectTrigger id="transfer-category">
                <SelectValue />
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
            <Label htmlFor="transfer-comment">Transfer Comment</Label>
            <Textarea
              id="transfer-comment"
              placeholder="Explain why this ticket is being transferred"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="px-3"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={loading} className="flex-1">
              {loading ? 'Transferring...' : 'Transfer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
