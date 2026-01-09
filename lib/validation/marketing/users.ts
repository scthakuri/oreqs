import {z} from 'zod';

export const marketingUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(150),
    last_name: z.string().min(1, 'Last name is required').max(150),
    email: z.email('Invalid email').optional().or(z.literal('')),
    phone: z.string()
        .regex(/^\+?1?\d{9,15}$/, 'Phone must be in format: +1234567890')
        .optional()
        .or(z.literal('')),
    group_ids: z.array(z.number()).optional(),
}).refine(
    (data) => data.email || data.phone,
    {
        message: 'Either email or phone is required',
        path: ['email'],
    }
);

export const groupSchema = z.object({
    name: z.string().min(1, 'Group name is required').max(100),
    description: z.string().optional().or(z.literal('')),
    member_ids: z.array(z.number()).optional(),
});

export type MarketingUserFormData = z.infer<typeof marketingUserSchema>;
export type GroupFormData = z.infer<typeof groupSchema>;