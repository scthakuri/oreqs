'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { UserCog, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { authService } from '@/lib/auth-service';
import { getRoleDisplayName } from '@/lib/permissions';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Page = () => {
  const { user, refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      middle_name: user?.middle_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        middle_name: user.middle_name || '',
        last_name: user.last_name,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await authService.updateProfile(data);
      await refetchUser();
      toast.success('Profile updated successfully!', {
        description: 'Your profile information has been saved.',
      });
    } catch (error: unknown) {
      console.error('Update profile error:', error);
      let errorMessage = 'Failed to update profile';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              errors?: Array<{ detail: string }>;
              detail?: string;
            }
          };
        };
        errorMessage =
          axiosError.response?.data?.errors?.[0]?.detail ||
          axiosError.response?.data?.detail ||
          errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const userName = `${user.first_name} ${user.last_name}`.trim();
  const userInitials =
    (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
          <UserCog className='size-5 text-primary' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile Settings</h1>
          <p className='text-muted-foreground'>Manage your personal information and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-center gap-6'>
                  <Avatar className='size-24'>
                    <AvatarImage src='' />
                    <AvatarFallback className='text-2xl uppercase'>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <Label>Profile Picture</Label>
                    <p className='text-sm text-muted-foreground'>
                      Avatar is automatically generated from your initials
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='first_name'>First Name *</Label>
                    <Input
                      id='first_name'
                      {...register('first_name')}
                      disabled={isLoading}
                    />
                    {errors.first_name && (
                      <p className='text-sm text-red-500'>{errors.first_name.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='last_name'>Last Name *</Label>
                    <Input
                      id='last_name'
                      {...register('last_name')}
                      disabled={isLoading}
                    />
                    {errors.last_name && (
                      <p className='text-sm text-red-500'>{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='middle_name'>Middle Name</Label>
                    <Input
                      id='middle_name'
                      {...register('middle_name')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input
                      id='phone'
                      {...register('phone')}
                      placeholder='+1 234 567 8900'
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    type='email'
                    value={user.email}
                    disabled
                    className='bg-muted'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='role'>Role</Label>
                  <Input
                    id='role'
                    value={getRoleDisplayName(user.role)}
                    disabled
                    className='bg-muted'
                  />
                  <p className='text-xs text-muted-foreground'>Contact support to change your role</p>
                </div>

                {user.country && (
                  <div className='space-y-2'>
                    <Label htmlFor='country'>Country</Label>
                    <Input
                      id='country'
                      value={user.country.name}
                      disabled
                      className='bg-muted'
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <Card className='sticky top-4'>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                  Save Changes
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={() => reset()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Separator />
                <div className='space-y-2 text-sm text-muted-foreground'>
                  <p>• Changes are saved when you click Save</p>
                  <p>• Email changes require admin approval</p>
                  <p>• Required fields are marked with *</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
