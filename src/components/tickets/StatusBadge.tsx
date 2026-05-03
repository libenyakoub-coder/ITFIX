import type { TicketStatus } from '@/types/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<TicketStatus, { label: string; className: string }> = {
    pending: {
      label: 'Pending',
      className: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]',
    },
    in_progress: {
      label: 'In Progress',
      className: 'bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info))]',
    },
    resolved: {
      label: 'Resolved',
      className: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]',
    },
    transferred: {
      label: 'Transferred',
      className: 'bg-muted text-muted-foreground hover:bg-muted',
    },
  };

  const variant = variants[status];

  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  );
}
