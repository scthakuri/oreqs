'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Shield, Loader2, KeyRound } from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { PasswordInput } from '@/components/ui/password-input';

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(1, 'New password is required'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.changePassword(data.current_password, data.new_password);
      toast.success('Password changed successfully!', {
        description: 'Your password has been updated.',
      });
      reset();
    } catch (error: unknown) {
      console.error('Change password error:', error);
      let errorMessage = 'Failed to change password';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              errors?: Array<{ detail: string }>;
              detail?: string;
              current_password?: string[];
            }
          };
        };
        errorMessage =
          axiosError.response?.data?.errors?.[0]?.detail ||
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.current_password?.[0] ||
          errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
          <Shield className='size-5 text-primary' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Security Settings</h1>
          <p className='text-muted-foreground'>Manage your account security and password</p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <KeyRound className='size-5' />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='current_password'>Current Password *</Label>
                  <PasswordInput
                    id='current_password'
                    {...register('current_password')}
                    disabled={isLoading}
                  />
                  {errors.current_password && (
                    <p className='text-sm text-red-500'>{errors.current_password.message}</p>
                  )}
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label htmlFor='new_password'>New Password *</Label>
                  <PasswordInput
                    id='new_password'
                    {...register('new_password')}
                    disabled={isLoading}
                  />
                  {errors.new_password && (
                    <p className='text-sm text-red-500'>{errors.new_password.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirm_password'>Confirm New Password *</Label>
                  <PasswordInput
                    id='confirm_password'
                    {...register('confirm_password')}
                    disabled={isLoading}
                  />
                  {errors.confirm_password && (
                    <p className='text-sm text-red-500'>{errors.confirm_password.message}</p>
                  )}
                </div>

                <div className='flex gap-3'>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                    Change Password
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => reset()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-1'>
          <Card className='sticky top-4'>
            <CardHeader>
              <CardTitle>Security Tips</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2 text-sm text-muted-foreground'>
                <p>• Use a strong, unique password</p>
                <p>• Don't reuse passwords from other sites</p>
                <p>• Consider using a password manager</p>
                <p>• Change your password regularly</p>
                <p>• Never share your password with anyone</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
