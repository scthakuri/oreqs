'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangePasswordSchema, ChangePasswordFormData } from '@/lib/validation/auth';
import { axiosClient } from '@/lib/axios-client';
import { ApiError } from '@/types/errors';

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_new_password: '',
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: ChangePasswordFormData) => {
            await axiosClient.post('/auth/change-password/', {
                old_password: data.old_password,
                new_password: data.new_password,
            });
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
            reset();
            onOpenChange(false);
        },
        onError: (error: ApiError) => {
            const errorData = error.response?.data;
            if (errorData && typeof errorData === 'object') {
                // Display specific error messages from the backend
                Object.entries(errorData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        toast.error(`${key}: ${value[0]}`);
                    } else if (typeof value === 'string') {
                        toast.error(value);
                    }
                });
            } else {
                toast.error('Failed to change password. Please try again.');
            }
        },
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePasswordMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Update your account password. You will need to enter your current password.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="old_password">Current Password</Label>
                        <Input
                            id="old_password"
                            type="password"
                            {...register('old_password')}
                        />
                        {errors.old_password && (
                            <p className="text-sm text-destructive">{errors.old_password.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input
                            id="new_password"
                            type="password"
                            {...register('new_password')}
                        />
                        {errors.new_password && (
                            <p className="text-sm text-destructive">{errors.new_password.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm_new_password">Confirm New Password</Label>
                        <Input
                            id="confirm_new_password"
                            type="password"
                            {...register('confirm_new_password')}
                        />
                        {errors.confirm_new_password && (
                            <p className="text-sm text-destructive">{errors.confirm_new_password.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Change Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
