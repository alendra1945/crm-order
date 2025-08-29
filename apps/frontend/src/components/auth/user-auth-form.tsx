'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { sigInWithEmail } from '@/hooks/use-user-query';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z.string().min(1, 'Please enter your password'),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({ className, redirectTo, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { auth } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const mutation = useMutation({
    mutationFn: sigInWithEmail,
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await mutation.mutateAsync({ payload: data });
      auth.setAccessToken(response?.accessToken, response?.refreshToken);
      router.replace(redirectTo || '/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-3', className)} {...props}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2  text-white cursor-pointer' disabled={isLoading}>
          {isLoading && <Loader2 className='animate-spin' />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
