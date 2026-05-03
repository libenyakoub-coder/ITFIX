import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-balance">IT-Fix</h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Internal IT Support System
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
