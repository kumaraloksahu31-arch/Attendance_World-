
import { LoginForm } from '@/app/components/login-form';
import { Logo } from '@/app/components/icons';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary">
            <Logo className="h-8 w-8" />
            <span className="font-headline">AttendEase Pro</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to access your dashboard and manage attendance.
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
