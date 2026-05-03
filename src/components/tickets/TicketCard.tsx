import type { Ticket } from '@/types/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  showEmployee?: boolean;
}

export function TicketCard({ ticket, onClick, showEmployee = false }: TicketCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-balance flex-1 min-w-0">{ticket.title}</h3>
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
          {ticket.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {ticket.category}
          </Badge>
          {ticket.technician && (
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              {ticket.technician.full_name}
            </Badge>
          )}
          {showEmployee && ticket.employee && (
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              {ticket.employee.full_name}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
