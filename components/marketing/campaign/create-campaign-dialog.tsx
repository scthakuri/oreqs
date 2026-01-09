'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {SearchableSelect} from '@/components/ui/SearchableSelect'
import {toast} from 'sonner'
import {Send} from 'lucide-react'
import {campaignsApi} from '@/lib/api/marketing/campaign'
import type {CampaignCreateData, Template} from '@/types/marketing/campaign'
import {campaignSchema, type CampaignFormData} from '@/lib/validation/marketing/campaign.schema'
import {setBackendErrors} from '@/lib/error-handler'
import {ApiError} from "@/types/errors"
import {useEffect} from 'react'

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification'

interface CreateCampaignDialogProps {
    campaignType: CampaignType
    open: boolean
    onOpenChange: (open: boolean) => void
    templates: Template[]
}

const campaignTypeConfig = {
    email: {
        title: 'Create Email Campaign',
        description: 'Send email messages to your customers',
        subjectLabel: 'Email Subject',
        subjectPlaceholder: 'Your Summer Special Offers Inside!',
        messageLabel: 'Email Content',
        messagePlaceholder: 'Your email content here...',
        messageHelper: 'Supports HTML and plain text',
        requiresSubject: true,
    },
    sms: {
        title: 'Create SMS Campaign',
        description: 'Send SMS messages to your customers',
        subjectLabel: null,
        subjectPlaceholder: null,
        messageLabel: 'SMS Message',
        messagePlaceholder: 'Your SMS message here...',
        messageHelper: '160 characters per SMS',
        requiresSubject: false,
    },
    whatsapp: {
        title: 'Create WhatsApp Campaign',
        description: 'Send WhatsApp messages to your customers',
        subjectLabel: null,
        subjectPlaceholder: null,
        messageLabel: 'WhatsApp Message',
        messagePlaceholder: 'Your WhatsApp message here...',
        messageHelper: 'Supports text and media',
        requiresSubject: false,
    },
    push_notification: {
        title: 'Create Push Notification',
        description: 'Send push notifications to your customers',
        subjectLabel: 'Notification Title',
        subjectPlaceholder: 'Your notification title',
        messageLabel: 'Notification Content',
        messagePlaceholder: 'Your notification message...',
        messageHelper: 'Keep it short and engaging',
        requiresSubject: true,
    },
}

const CreateCampaignDialog = ({campaignType, open, onOpenChange, templates}: CreateCampaignDialogProps) => {
    const queryClient = useQueryClient()
    const config = campaignTypeConfig[campaignType]

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors},
        setValue,
        watch,
        reset,
        setError,
        control,
    } = useForm<CampaignFormData>({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
            campaign_type: campaignType,
            name: '',
            description: '',
            subject: '',
            message: '',
            status: 'draft',
            send_to_all: false,
            is_active: true,
        },
    })

    const status = watch('status')
    const templateValue = watch('template')

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            reset({
                campaign_type: campaignType,
                name: '',
                description: '',
                subject: '',
                message: '',
                status: 'draft',
                send_to_all: false,
                is_active: true,
            })
        }
    }, [open, campaignType, reset])

    // Auto-fill subject and message when template changes
    useEffect(() => {
        if (templateValue) {
            const templateId = typeof templateValue === 'string' ? parseInt(templateValue) : templateValue
            const template = templates.find(t => t.id === templateId)
            if (template) {
                setValue('subject', template.subject || '')
                setValue('message', template.message || '')
                toast.success('Template loaded')
            }
        }
    }, [templateValue, templates, setValue])

    const createMutation = useMutation({
        mutationFn: (data: CampaignFormData) => {
            const campaignData: CampaignCreateData = {
                campaign_type: data.campaign_type,
                name: data.name,
                description: data.description || '',
                subject: data.subject || '',
                message: data.message,
                status: data.status || 'draft',
                scheduled_date: data.scheduled_date,
                send_to_all: data.send_to_all || false,
                is_active: data.is_active !== false,
                template: data.template,
                dealer: data.dealer,
                clients: data.clients,
                branch: data.branch,
                groups: data.groups,
            }
            return campaignsApi.create(campaignType, campaignData)
        },
        onSuccess: async (data) => {
            // Invalidate and refetch campaigns list
            await queryClient.invalidateQueries({queryKey: ['campaigns', campaignType]})
            await queryClient.refetchQueries({queryKey: ['campaigns', campaignType]})

            toast.success('Campaign created successfully', {
                description: `${data.name} has been created.`
            })
            onOpenChange(false)
            reset()
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = (data: CampaignFormData) => {
        // Additional validation based on campaign type
        if (config.requiresSubject && !data.subject?.trim()) {
            setError('subject', {message: `${config.subjectLabel} is required`})
            return
        }
        createMutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-150 max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>
                        {config.description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit(onSubmit)} className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Campaign Name *</Label>
                        <Input
                            id='name'
                            placeholder='Summer Campaign'
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className='text-sm text-destructive'>{errors.name.message}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Campaign description...'
                            {...register('description')}
                            rows={2}
                        />
                        {errors.description && (
                            <p className='text-sm text-destructive'>{errors.description.message}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='template'>Use Template (Optional)</Label>
                        <SearchableSelect
                            control={control}
                            name='template'
                            options={templates.map((template) => ({
                                value: template.id.toString(),
                                label: template.name,
                            }))}
                            placeholder='Select a template'
                            searchPlaceholder='Search templates...'
                        />
                        <p className='text-xs text-muted-foreground'>
                            Load a pre-made template or write your own
                        </p>
                    </div>

                    {config.requiresSubject && config.subjectLabel && (
                        <div className='space-y-2'>
                            <Label htmlFor='subject'>{config.subjectLabel} *</Label>
                            <Input
                                id='subject'
                                placeholder={config.subjectPlaceholder || ''}
                                {...register('subject')}
                            />
                            {errors.subject && (
                                <p className='text-sm text-destructive'>{errors.subject.message}</p>
                            )}
                        </div>
                    )}

                    <div className='space-y-2'>
                        <Label htmlFor='message'>{config.messageLabel} *</Label>
                        <Textarea
                            id='message'
                            placeholder={config.messagePlaceholder}
                            {...register('message')}
                            rows={8}
                        />
                        {errors.message && (
                            <p className='text-sm text-destructive'>{errors.message.message}</p>
                        )}
                        <p className='text-xs text-muted-foreground'>
                            {config.messageHelper}
                        </p>
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='status'>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setValue('status', value as 'draft' | 'scheduled')}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='draft'>Draft</SelectItem>
                                    <SelectItem value='scheduled'>Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {status === 'scheduled' && (
                            <div className='space-y-2'>
                                <Label htmlFor='scheduled_date'>Schedule Date *</Label>
                                <Input
                                    id='scheduled_date'
                                    type='datetime-local'
                                    {...register('scheduled_date')}
                                />
                                {errors.scheduled_date && (
                                    <p className='text-sm text-destructive'>{errors.scheduled_date.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={createMutation.isPending}>
                            {createMutation.isPending ? (
                                'Creating...'
                            ) : (
                                <>
                                    <Send className='mr-2 size-4'/>
                                    {status === 'scheduled' ? 'Schedule Campaign' : 'Create Campaign'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCampaignDialog