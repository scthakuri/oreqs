import {z} from 'zod'

export const templateSchema = z.object({
    name: z.string().min(1, 'Template name is required').max(100, 'Name must be less than 100 characters'),
    subject: z.string().max(265, 'Subject must be less than 265 characters').optional().or(z.literal('')),
    preview_text: z.string().max(150, 'Preview text must be less than 150 characters').optional().or(z.literal('')),
    category: z.enum(['welcome', 'password_reset', 'promotion', 'notification', 'newsletter', 'transactional', 'birthday', 'anniversary', 'other']),
    message: z.string().min(1, 'Message is required'),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
})

export type TemplateFormData = z.infer<typeof templateSchema>

export const campaignSchema = z.object({
    campaign_type: z.enum(['email', 'sms', 'whatsapp', 'push_notification']),
    name: z.string().min(1, 'Campaign name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().optional().or(z.literal('')),
    template: z.number().optional(),
    subject: z.string().max(265, 'Subject must be less than 265 characters').optional().or(z.literal('')),
    message: z.string().min(1, 'Message is required'),
    status: z.enum(['draft', 'scheduled']).optional(),
    scheduled_date: z.string().optional().or(z.literal('')),
    send_to_all: z.boolean().optional(),
    dealer: z.number().optional(),
    clients: z.array(z.number()).optional(),
    branch: z.array(z.number()).optional(),
    groups: z.array(z.number()).optional(),
    is_active: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.status === 'scheduled' && !data.scheduled_date) {
            return false
        }
        return true
    },
    {
        message: 'Scheduled date is required for scheduled campaigns',
        path: ['scheduled_date'],
    }
)

export type CampaignFormData = z.infer<typeof campaignSchema>