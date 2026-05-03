export type UserRole = 'admin' | 'technician' | 'employee';

export type TicketCategory = 'hardware' | 'software' | 'network' | 'other';

export type TicketStatus = 'pending' | 'in_progress' | 'transferred' | 'resolved';

export type TechnicianSpecialty = 'hardware' | 'software' | 'network';

export type TechnicianAvailability = 'available' | 'busy';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
  office_location: string;
  created_at: string;
}

export interface Technician {
  id: string;
  full_name: string;
  email: string;
  specialty: TechnicianSpecialty;
  availability: TechnicianAvailability;
  created_at: string;
}

export interface Ticket {
  id: string;
  employee_id: string;
  technician_id: string | null;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  office_location: string;
  screenshot_url: string | null;
  transfer_comment: string | null;
  created_at: string;
  employee?: Employee;
  technician?: Technician;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  category: TicketCategory;
  office_location: string;
  screenshot_url?: string | null;
}

export interface CreateTechnicianInput {
  full_name: string;
  email: string;
  password: string;
  specialty: TechnicianSpecialty;
}
