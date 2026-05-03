import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TransferTicketDialog } from '@/components/tickets/TransferTicketDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wrench, Laptop, Network, HelpCircle, ArrowRightLeft, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Ticket, TicketCategory } from '@/types/types';

export function TechnicianDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hardware');

  const sidebarItems = [
    { label: 'Hardware', path: '/tech-dashboard#hardware', icon: <Wrench className="h-4 w-4" /> },
    { label: 'Software', path: '/tech-dashboard#software', icon: <Laptop className="h-4 w-4" /> },
    { label: 'Network', path: '/tech-dashboard#network', icon: <Network className="h-4 w-4" /> },
    { label: 'Other', path: '/tech-dashboard#other', icon: <HelpCircle className="h-4 w-4" /> },
    { label: 'Transferred', path: '/tech-dashboard#transferred', icon: <ArrowRightLeft className="h-4 w-4" /> },
    { label: 'My Assigned', path: '/tech-dashboard#assigned', icon: <UserIcon className="h-4 w-4" /> },
  ];

  const fetchTickets = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        employee:employees(*),
        technician:technicians(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleAccept = async (ticketId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('tickets')
      .update({ technician_id: user.id, status: 'in_progress' })
      .eq('id', ticketId);

    if (error) {
      toast.error('Failed to accept ticket');
    } else {
      toast.success('Ticket accepted');
      fetchTickets();
      setSelectedTicket(null);
    }
  };

  const handleMarkInProgress = async (ticketId: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'in_progress' })
      .eq('id', ticketId);

    if (error) {
      toast.error('Failed to update ticket');
    } else {
      toast.success('Ticket marked as in progress');
      fetchTickets();
      setSelectedTicket(null);
    }
  };

  const handleResolve = async (ticketId: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'resolved' })
      .eq('id', ticketId);

    if (error) {
      toast.error('Failed to resolve ticket');
    } else {
      toast.success('Ticket resolved');
      fetchTickets();
      setSelectedTicket(null);
    }
  };

  const filterTickets = (category: TicketCategory | 'transferred' | 'assigned') => {
    if (category === 'transferred') {
      return tickets.filter((t) => t.status === 'transferred');
    }
    if (category === 'assigned') {
      return tickets.filter((t) => t.technician_id === user?.id);
    }
    return tickets.filter(
      (t) => t.category === category && (t.status === 'pending' || t.status === 'in_progress')
    );
  };

  const renderTicketList = (category: TicketCategory | 'transferred' | 'assigned') => {
    const filteredTickets = filterTickets(category);

    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      );
    }

    if (filteredTickets.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No tickets in this category</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)}
            showEmployee
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-balance">Technician Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-pretty">
            Manage and resolve IT support tickets
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap flex">
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
            <TabsTrigger value="transferred">Transferred</TabsTrigger>
            <TabsTrigger value="assigned">My Assigned</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="hardware">{renderTicketList('hardware')}</TabsContent>
            <TabsContent value="software">{renderTicketList('software')}</TabsContent>
            <TabsContent value="network">{renderTicketList('network')}</TabsContent>
            <TabsContent value="other">{renderTicketList('other')}</TabsContent>
            <TabsContent value="transferred">{renderTicketList('transferred')}</TabsContent>
            <TabsContent value="assigned">{renderTicketList('assigned')}</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-balance">{selectedTicket?.title}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-pretty">{selectedTicket.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="mt-1 capitalize">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="mt-1 capitalize">{selectedTicket.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Office Location</p>
                  <p className="mt-1">{selectedTicket.office_location}</p>
                </div>
                {selectedTicket.employee && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
                    <p className="mt-1">{selectedTicket.employee.full_name}</p>
                  </div>
                )}
              </div>
              {selectedTicket.transfer_comment && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Transfer Comment</p>
                  <p className="text-pretty text-sm bg-muted p-3 rounded">{selectedTicket.transfer_comment}</p>
                </div>
              )}
              {selectedTicket.screenshot_url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Screenshot</p>
                  <img
                    src={selectedTicket.screenshot_url}
                    alt="Ticket screenshot"
                    className="rounded border max-w-full h-auto"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 pt-4">
                {!selectedTicket.technician_id && (
                  <Button onClick={() => handleAccept(selectedTicket.id)} className="w-full">
                    Accept Ticket
                  </Button>
                )}
                {selectedTicket.technician_id === user?.id && selectedTicket.status === 'pending' && (
                  <Button onClick={() => handleMarkInProgress(selectedTicket.id)} className="w-full">
                    Mark as In Progress
                  </Button>
                )}
                {selectedTicket.technician_id === user?.id && selectedTicket.status === 'in_progress' && (
                  <Button onClick={() => handleResolve(selectedTicket.id)} className="w-full">
                    Mark as Resolved
                  </Button>
                )}
                {selectedTicket.technician_id === user?.id && selectedTicket.status !== 'resolved' && (
                  <Button
                    variant="outline"
                    onClick={() => setTransferDialogOpen(true)}
                    className="w-full"
                  >
                    Transfer Ticket
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      {selectedTicket && (
        <TransferTicketDialog
          ticketId={selectedTicket.id}
          currentCategory={selectedTicket.category}
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          onSuccess={() => {
            fetchTickets();
            setSelectedTicket(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
