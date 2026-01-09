import {z} from 'zod'

export const dealerSchema = z.object({
    // Personal Information
    first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middle_name: z.string().max(50, 'Middle name is too long').optional().or(z.literal('')),
    last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
    password: z.string(),

    // Company Information
    company_name: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
    registration_number: z.string().max(100, 'Registration number is too long').optional().or(z.literal('')),
    tax_id: z.string().max(100, 'Tax ID is too long').optional().or(z.literal('')),
    company_address: z.string().max(255, 'Address is too long').optional().or(z.literal('')),
    company_city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
    company_state: z.string().max(100, 'State/Province is too long').optional().or(z.literal('')),
    company_postal_code: z.string().max(20, 'Postal code is too long').optional().or(z.literal('')),

    // Assignment & Subscription
    country_id: z.number({message: 'Country is required'}).min(1, 'Country is required'),
    subscription_plan: z.enum(['demo', 'premium', 'lifetime'], {message: 'Subscription plan is required'}),
    subscription_start: z.date().optional(),
    subscription_end: z.date().nullable().optional(),
    clients_limit: z.number({message: 'Clients limit is required'}).min(0, 'Clients limit must be 0 or greater'),
})

export const dealerUpdateSchema = z.object({
    country_id: z.number().min(1, 'Country is required').optional(),
    country_admin_id: z.number().min(1, 'Country admin is required').optional(),
    company_id: z.number().nullable().optional(),
    subscription_plan: z.enum(['demo', 'premium']).optional(),
    subscription_start: z.date().optional(),
    subscription_end: z.date().optional(),
    is_active: z.boolean().optional(),
})

export type DealerFormData = z.infer<typeof dealerSchema>
export type DealerUpdateFormData = z.infer<typeof dealerUpdateSchema>
