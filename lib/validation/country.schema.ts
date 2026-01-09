import {z} from 'zod'

export const countrySchema = z.object({
    name: z.string().min(1, 'Country name is required').max(100, 'Country name is too long'),
    code: z.string().min(1, 'Country code is required').max(10, 'Country code is too long'),
    dial_code: z.string().min(1, 'Dial code is required').max(10, 'Dial code is too long'),
    currency_code: z.string().max(3, 'Currency code must be 3 characters').optional().or(z.literal('')),
    currency_symbol: z.string().max(10, 'Currency symbol is too long').optional().or(z.literal('')),
    flag: z.string().nullable().optional(),
    domain: z.string().max(100, 'Domain is too long').nullable().optional(),
    is_active: z.boolean(),
})

export type CountryFormData = z.infer<typeof countrySchema>
