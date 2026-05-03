import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { AdminPanel } from './pages/AdminPanel';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <SignupPage />,
    public: true,
  },
  {
    name: 'Employee Dashboard',
    path: '/dashboard',
    element: <EmployeeDashboard />,
  },
  {
    name: 'Technician Dashboard',
    path: '/tech-dashboard',
    element: <TechnicianDashboard />,
  },
  {
    name: 'Admin Panel',
    path: '/admin',
    element: <AdminPanel />,
  },
];
