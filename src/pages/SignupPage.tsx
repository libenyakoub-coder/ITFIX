import { AuthLayout } from '@/components/layouts/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}