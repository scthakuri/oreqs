'use client'

import {useState} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Plus, Copy, Trash2} from 'lucide-react'
import {toast} from 'sonner'
import {templatesApi} from '@/lib/api/marketing/campaign'
import {useCampaignTypeAccess} from '@/hooks/use-marketing-permissions'
import type {Template} from '@/types/marketing/campaign'
import CreateTemplateDialog from './create-template-dialog'

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification'

interface TemplatesTabProps {
    campaignType: CampaignType
    templates: Template[]
    isLoading: boolean
}

const templateTypeLabels = {
    email: {title: 'Email Templates', description: 'Reusable email templates for quick campaigns'},
    sms: {title: 'SMS Templates', description: 'Reusable SMS templates for quick campaigns'},
    whatsapp: {title: 'WhatsApp Templates', description: 'Reusable WhatsApp templates for quick campaigns'},
    push_notification: {title: 'Push Notification Templates', description: 'Reusable push notification templates for quick campaigns'},
}

const TemplatesTab = ({campaignType, templates, isLoading}: TemplatesTabProps) => {
    const [showNewTemplate, setShowNewTemplate] = useState(false)
    const queryClient = useQueryClient()
    const labels = templateTypeLabels[campaignType]
    const hasAccess = useCampaignTypeAccess(campaignType)

    const deleteMutation = useMutation({
        mutationFn: (id: number) => templatesApi.delete(campaignType, id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['templates', campaignType]})
            await queryClient.refetchQueries({queryKey: ['templates', campaignType]})
            toast.success('Template deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete template')
        },
    })

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id)
        }
    }

    const handleCopyTemplate = (template: Template) => {
        // Store in clipboard or navigate to create campaign with template
        navigator.clipboard.writeText(JSON.stringify({
            subject: template.subject,
            message: template.message
        }))
        toast.success('Template copied to clipboard')
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{labels.title}</CardTitle>
                    <CardDescription>{labels.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center justify-center py-8'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>{labels.title}</CardTitle>
                            <CardDescription>{labels.description}</CardDescription>
                        </div>
                        {hasAccess && (
                            <Button onClick={() => setShowNewTemplate(true)}>
                                <Plus className='mr-2 size-4'/>
                                New Template
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {templates.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-muted-foreground mb-4'>No templates found</p>
                            {hasAccess && (
                                <Button onClick={() => setShowNewTemplate(true)}>
                                    <Plus className='mr-2 size-4'/>
                                    Create Your First Template
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            {templates.map((template) => (
                                <Card key={template.id} className='hover:shadow-md transition-shadow'>
                                    <CardHeader className='pb-3'>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <CardTitle className='text-base'>{template.name}</CardTitle>
                                                <Badge variant='outline' className='mt-2 text-xs'>
                                                    {template.category_display}
                                                </Badge>
                                            </div>
                                            {hasAccess && (
                                                <div className='flex gap-1'>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => handleCopyTemplate(template)}
                                                    >
                                                        <Copy className='size-4'/>
                                                    </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handleDelete(template.id, template.name)}
                                                >
                                                    <Trash2 className='size-4 text-destructive'/>
                                                </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className='space-y-2'>
                                        {template.subject && (
                                            <div>
                                                <p className='text-xs font-medium text-muted-foreground'>Subject:</p>
                                                <p className='text-sm font-medium line-clamp-1'>{template.subject}</p>
                                            </div>
                                        )}
                                        {template.preview_text && (
                                            <div>
                                                <p className='text-xs font-medium text-muted-foreground'>Preview:</p>
                                                <p className='text-sm text-muted-foreground line-clamp-2'>
                                                    {template.preview_text}
                                                </p>
                                            </div>
                                        )}
                                        {template.description && (
                                            <div>
                                                <p className='text-xs font-medium text-muted-foreground'>Description:</p>
                                                <p className='text-sm text-muted-foreground line-clamp-2'>
                                                    {template.description}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateTemplateDialog
                campaignType={campaignType}
                open={showNewTemplate}
                onOpenChange={setShowNewTemplate}
            />
        </>
    )
}

export default TemplatesTab