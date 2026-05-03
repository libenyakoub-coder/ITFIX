import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CreateTicketForm } from '@/components/tickets/CreateTicketForm';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Ticket, Plus, User as UserIcon } from 'lucide-react';
import type { Ticket as TicketType } from '@/types/types';

export function EmployeeDashboard() {
  const { user, employee } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { label: 'My Tickets', path: '/dashboard', icon: <Ticket className="h-4 w-4" /> },
    { label: 'Create Ticket', path: '/dashboard#create', icon: <Plus className="h-4 w-4" /> },
    { label: 'Profile', path: '/dashboard#profile', icon: <UserIcon className="h-4 w-4" /> },
  ];

  const fetchTickets = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        technician:technicians(*)
      `)
      .eq('employee_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="p-4 md:p-8 space-y-8">
        {/* Create Ticket Section */}
        <section id="create">
          <CreateTicketForm onSuccess={fetchTickets} />
        </section>

        {/* My Tickets Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-balance">My Tickets</h2>
            <p className="text-muted-foreground mt-1 text-pretty">
              View and track your submitted IT support requests
            </p>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No tickets yet. Create your first ticket above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Profile Section */}
        <section id="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Profile</CardTitle>
              <CardDescription className="text-pretty">
                Your employee information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="mt-1">{employee?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="mt-1">{employee?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="mt-1">{employee?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Office Location</p>
                  <p className="mt-1">{employee?.office_location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
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
                  <div className="mt-1">
                    <span className="capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Office Location</p>
                  <p className="mt-1">{selectedTicket.office_location}</p>
                </div>
                {selectedTicket.technician && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Technician</p>
                    <p className="mt-1">{selectedTicket.technician.full_name}</p>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
