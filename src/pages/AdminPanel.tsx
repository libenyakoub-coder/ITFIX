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
      const { data, error } = await supabase.functions.invoke('create-technician', {
        body: {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          specialty: formData.specialty,
        },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        throw new Error(errorMsg || error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success('Technician created successfully');
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
          <h2 className="text-2xl font-semibold text-balance">Admin Panel</h2>

          {/* ✅ correction ici */}
          <p className="text-sm text-muted-foreground">
            Connecté : {user?.email}
          </p>

          <p className="text-muted-foreground mt-1 text-pretty">
            Manage IT technicians and system settings
          </p>
        </div>

        {/* Create Technician Section */}
        <section id="create">
          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Create Technician</CardTitle>
              <CardDescription className="text-pretty">
                Add a new IT technician to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      placeholder="John Smith"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="px-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="px-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="px-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, specialty: value as TechnicianSpecialty })
                      }
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Technician'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Technician List Section */}
        <section id="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Technician List</CardTitle>
              <CardDescription className="text-pretty">
                All registered IT technicians
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full max-w-full overflow-x-auto">
                <Table className="[&>div]:max-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Full Name</TableHead>
                      <TableHead className="whitespace-nowrap">Email</TableHead>
                      <TableHead className="whitespace-nowrap">Specialty</TableHead>
                      <TableHead className="whitespace-nowrap">Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground whitespace-nowrap">
                          No technicians yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      technicians.map((tech) => (
                        <TableRow key={tech.id}>
                          <TableCell className="whitespace-nowrap">{tech.full_name}</TableCell>
                          <TableCell className="whitespace-nowrap">{tech.email}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="capitalize">
                              {tech.specialty}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={tech.availability === 'available' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {tech.availability}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
