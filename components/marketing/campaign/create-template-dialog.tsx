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
import {SearchableSelect} from "@/components/ui/SearchableSelect"
import {toast} from 'sonner'
import {templatesApi} from '@/lib/api/marketing/campaign'
import type {TemplateCreateData} from '@/types/marketing/campaign'
import {templateSchema, type TemplateFormData} from '@/lib/validation/marketing/campaign.schema'
import {setBackendErrors} from '@/lib/error-handler'
import {ApiError} from "@/types/errors"
import {useEffect} from 'react'

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification'

interface CreateTemplateDialogProps {
    campaignType: CampaignType
    open: boolean
    onOpenChange: (open: boolean) => void
}

const campaignTypeConfig = {
    email: {
        title: 'Create Email Template',
        description: 'Create a reusable email template',
        requiresSubject: true,
        requiresPreview: true,
    },
    sms: {
        title: 'Create SMS Template',
        description: 'Create a reusable SMS template',
        requiresSubject: false,
        requiresPreview: false,
    },
    whatsapp: {
        title: 'Create WhatsApp Template',
        description: 'Create a reusable WhatsApp template',
        requiresSubject: false,
        requiresPreview: false,
    },
    push_notification: {
        title: 'Create Push Notification Template',
        description: 'Create a reusable push notification template',
        requiresSubject: true,
        requiresPreview: false,
    },
}

const categoryOptions = [
    {value: 'welcome', label: 'Welcome'},
    {value: 'password_reset', label: 'Password Reset'},
    {value: 'promotion', label: 'Promotion'},
    {value: 'notification', label: 'Notification'},
    {value: 'newsletter', label: 'Newsletter'},
    {value: 'transactional', label: 'Transactional'},
    {value: 'birthday', label: 'Birthday'},
    {value: 'anniversary', label: 'Anniversary'},
    {value: 'other', label: 'Other'},
]

const CreateTemplateDialog = ({campaignType, open, onOpenChange}: CreateTemplateDialogProps) => {
    const queryClient = useQueryClient()
    const config = campaignTypeConfig[campaignType]

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors},
        reset,
        setError,
        control,
    } = useForm<TemplateFormData>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: '',
            subject: '',
            preview_text: '',
            category: 'promotion',
            message: '',
            description: '',
            is_active: true,
        },
    })

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            reset({
                name: '',
                subject: '',
                preview_text: '',
                category: 'promotion',
                message: '',
                description: '',
                is_active: true,
            })
        }
    }, [open, reset])

    const createMutation = useMutation({
        mutationFn: (data: TemplateFormData) => {
            const templateData: TemplateCreateData = {
                name: data.name,
                subject: data.subject || '',
                preview_text: data.preview_text || '',
                category: data.category,
                message: data.message,
                description: data.description || '',
                is_active: data.is_active !== false,
            }
            return templatesApi.create(campaignType, templateData)
        },
        onSuccess: async (data) => {
            // Invalidate and refetch templates list
            await queryClient.invalidateQueries({queryKey: ['templates', campaignType]})
            await queryClient.refetchQueries({queryKey: ['templates', campaignType]})

            toast.success('Template created successfully', {
                description: `${data.name} has been created.`
            })
            onOpenChange(false)
            reset()
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        }
    })

    const onSubmit = (data: TemplateFormData) => {
        // Additional validation based on campaign type
        if (config.requiresSubject && !data.subject?.trim()) {
            setError('subject', {message: 'Subject is required'})
            return
        }
        createMutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-150'>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>
                        {config.description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit(onSubmit)} className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Template Name *</Label>
                        <Input
                            id='name'
                            placeholder='Welcome Template'
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className='text-sm text-destructive'>{errors.name.message}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='category'>Category</Label>
                        <SearchableSelect
                            control={control}
                            name='category'
                            options={categoryOptions}
                            placeholder='Select a category'
                            searchPlaceholder='Search categories...'
                        />
                        {errors.category && (
                            <p className='text-sm text-destructive'>{errors.category.message}</p>
                        )}
                    </div>

                    {config.requiresSubject && (
                        <div className='space-y-2'>
                            <Label htmlFor='subject'>Subject Line *</Label>
                            <Input
                                id='subject'
                                placeholder='Welcome to {brand}!'
                                {...register('subject')}
                            />
                            {errors.subject && (
                                <p className='text-sm text-destructive'>{errors.subject.message}</p>
                            )}
                        </div>
                    )}

                    {config.requiresPreview && (
                        <div className='space-y-2'>
                            <Label htmlFor='preview_text'>Preview Text</Label>
                            <Input
                                id='preview_text'
                                placeholder='Short preview text...'
                                {...register('preview_text')}
                            />
                            {errors.preview_text && (
                                <p className='text-sm text-destructive'>{errors.preview_text.message}</p>
                            )}
                            <p className='text-xs text-muted-foreground'>
                                Shows in email inbox preview
                            </p>
                        </div>
                    )}

                    <div className='space-y-2'>
                        <Label htmlFor='message'>Message Content *</Label>
                        <Textarea
                            id='message'
                            placeholder='Use {variables} for dynamic content'
                            {...register('message')}
                            rows={6}
                        />
                        {errors.message && (
                            <p className='text-sm text-destructive'>{errors.message.message}</p>
                        )}
                        <p className='text-xs text-muted-foreground'>
                            Use variables like {'{'}brand{'}'}, {'{'}name{'}'}, {'{'}discount{'}'} for dynamic values
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Template description...'
                            {...register('description')}
                            rows={2}
                        />
                        {errors.description && (
                            <p className='text-sm text-destructive'>{errors.description.message}</p>
                        )}
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Template'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTemplateDialog