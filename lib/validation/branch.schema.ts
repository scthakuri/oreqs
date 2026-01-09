import {z} from 'zod'

export const branchSchema = z.object({
    // Personal Information
    first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middle_name: z.string().max(50, 'Middle name is too long').optional().or(z.literal('')),
    last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),

    // Branch Information
    client_id: z.number({message: 'Client is required'}).min(1, 'Client is required'),
    branch_name: z.string().min(1, 'Branch name is required').max(200, 'Branch name is too long'),
    branch_code: z.string().min(1, 'Branch code is required').max(50, 'Branch code is too long'),
    address: z.string().max(255, 'Address is too long').optional().or(z.literal('')),
    city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
})

export type BranchFormData = z.infer<typeof branchSchema>
