'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await signUp(values.email, values.password, values.name, 'student', values.phone);
        toast({
          title: 'Registration Successful',
          description: 'Please check your email to verify your account.',
        });
        router.push('/');
      } catch (error: any) {
        let description = 'An unexpected error occurred.';
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              description = 'This email address is already in use by another account.';
              break;
            case 'auth/weak-password':
              description = 'The password is too weak. Please choose a stronger password.';
              break;
            default:
              description = error.message;
              break;
          }
        }
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: description,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(123) 456-7890" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
