import { z } from 'zod';

export const ChangePasswordSchema = z.object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters long'),
    confirm_new_password: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: "New passwords don't match",
    path: ['confirm_new_password'],
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
