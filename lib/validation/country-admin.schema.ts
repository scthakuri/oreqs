import {z} from 'zod'

export const countryAdminSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    middle_name: z.string().max(50, 'Middle name is too long').optional().or(z.literal('')),
    last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.email('Invalid email address'),
    phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
    password: z.string().or(z.literal('')),
    country_id: z.number({message: 'Country is required'}).min(1, 'Country is required'),
})

export type CountryAdminFormData = z.infer<typeof countryAdminSchema>
