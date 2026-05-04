import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Technician, TechnicianSpecialty } from '@/types/types';

export function AdminPanel() {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    specialty: '' as TechnicianSpecialty | '',
  });
  const [loading, setLoading] = useState(false);

  const sidebarItems = [
    { label: 'Create Technician', path: '/admin#create', icon: <Shield className="h-4 w-4" /> },
    { label: 'Technician List', path: '/admin#list', icon: <Users className="h-4 w-4" /> },
  ];

  const fetchTechnicians = async () => {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTechnicians(data);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.specialty) {
      toast.error('Please select a specialty');
      return;
    }

    setLoading(true);

    try {
      // ✅ 1. créer utilisateur
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || 'Erreur création user');
      }

      // ⚠️ important: vérifier email déjà utilisé
      if (!data.user.id) {
        throw new Error('User creation failed');
      }

      // ✅ 2. insert avec id
      const { error: insertError } = await supabase
        .from('technicians')
        .insert({
          id: data.user.id,
          full_name: formData.full_name,
          email: formData.email,
          specialty: formData.specialty,
          availability: 'available',
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success('Technician created successfully');

      // reset form
      setFormData({
        full_name: '',
        email: '',
        password: '',
        specialty: '',
      });

      fetchTechnicians();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create technician');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="p-4 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">
            Connecté : {user?.email}
          </p>
          <p className="text-muted-foreground mt-1">
            Manage IT technicians and system settings
          </p>
        </div>

        {/* CREATE */}
        <section id="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Technician</CardTitle>
              <CardDescription>
                Add a new IT technician to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                <Input
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />

                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Select
                  value={formData.specialty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, specialty: value as TechnicianSpecialty })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Technician'}
                </Button>

              </form>
            </CardContent>
          </Card>
        </section>

        {/* LIST */}
        <section id="list">
          <Card>
            <CardHeader>
              <CardTitle>Technician List</CardTitle>
              <CardDescription>
                All registered IT technicians
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Availability</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {technicians.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No technicians yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    technicians.map((tech) => (
                      <TableRow key={tech.id}>
                        <TableCell>{tech.full_name}</TableCell>
                        <TableCell>{tech.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tech.specialty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{tech.availability}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
