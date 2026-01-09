'use client'

import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Switch} from '@/components/ui/switch'
import {Skeleton} from '@/components/ui/skeleton'
import {MessageSquare, Mail as MailIcon, Phone, CheckCircle2, XCircle, Settings, Trash2, Lock} from 'lucide-react'
import {integrationsApi} from '@/lib/api/marketing/integration'
import {VerifyOtp} from './verify-otp'
import {toast} from 'sonner'
import {useIntegrationAccess} from '@/hooks/use-marketing-permissions'
import type {Integration, IntegrationType} from '@/types/marketing/integration'
import {IntegrationFormDialog} from "@/components/marketing/Integration-form-dialog";

const integrationConfigs: Record<IntegrationType, {
    title: string
    description: string
    icon: typeof Phone
    color: string
}> = {
    twilio: {
        title: 'Twilio SMS',
        description: 'Send SMS messages via Twilio',
        icon: Phone,
        color: 'text-red-500',
    },
    aakash_sms: {
        title: 'Aakash SMS',
        description: 'Send SMS messages via Aakash SMS',
        icon: MessageSquare,
        color: 'text-blue-500',
    },
    sparrow_sms: {
        title: 'Sparrow SMS',
        description: 'Send SMS messages via Sparrow SMS',
        icon: MessageSquare,
        color: 'text-green-500',
    },
    smtp: {
        title: 'Email SMTP',
        description: 'Send emails via custom SMTP server',
        icon: MailIcon,
        color: 'text-purple-500',
    }
}

function IntegrationCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-10 w-10 rounded-lg"/>
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-32"/>
                            <Skeleton className="h-4 w-48"/>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg"/>
                <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1"/>
                    <Skeleton className="h-9 w-20"/>
                </div>
            </CardContent>
        </Card>
    )
}

export function IntegrationList() {
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
    const [verifyingIntegration, setVerifyingIntegration] = useState<Integration | null>(null)
    const queryClient = useQueryClient()
    const { canManageIntegrations, canUseSMSIntegration, canUseEmailIntegration, hasAnyIntegrationAccess } = useIntegrationAccess()

    const {data: integrations = [], isLoading} = useQuery({
        queryKey: ['integrations'],
        queryFn: integrationsApi.getAll,
        enabled: canManageIntegrations,
    })

    const canUseIntegration = (type: IntegrationType): boolean => {
        if (type === 'smtp') return canUseEmailIntegration
        return canUseSMSIntegration
    }

    const updateStatusMutation = useMutation({
        mutationFn: ({id, is_active}: { id: number; is_active: boolean }) =>
            integrationsApi.updateStatus(id, {is_active}),
        onSuccess: async () => {
            toast.success('Integration status updated')
            await queryClient.invalidateQueries({queryKey: ['integrations']})
        },
        onError: () => {
            toast.error('Failed to update integration status')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: integrationsApi.delete,
        onSuccess: async () => {
            toast.success('Integration deleted successfully')
            await queryClient.invalidateQueries({queryKey: ['integrations']})
        },
        onError: () => {
            toast.error('Failed to delete integration')
        },
    })

    const handleSetupOrEdit = (integration: Integration) => {
        setSelectedIntegration(integration)
    }

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete ${title} integration?`)) {
            deleteMutation.mutate(id)
        }
    }

    if (!canManageIntegrations) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Integrations Not Available</CardTitle>
                    </div>
                    <CardDescription>
                        You don't have permission to manage integrations. Please contact your administrator.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (!hasAnyIntegrationAccess) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Custom Integrations Not Enabled</CardTitle>
                    </div>
                    <CardDescription>
                        Your account is not configured for custom integrations. Please contact your administrator to enable SMS gateway or email service integration.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                    <IntegrationCardSkeleton key={i}/>
                ))}
            </div>
        )
    }

    const availableIntegrations = integrations.filter(integration => canUseIntegration(integration.type))

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {availableIntegrations.map((integration) => {
                    const config = integrationConfigs[integration.type]
                    const Icon = config?.icon || MessageSquare
                    const isConfigured = integration.id !== null

                    return (
                        <Card key={integration.type} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <Icon className={`h-5 w-5 ${config?.color || 'text-gray-500'}`}/>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-lg truncate">
                                                {integration.title || config?.title || integration.type}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {integration.description || config?.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {isConfigured && (
                                        <div className="shrink-0">
                                            {integration.is_verified ? (
                                                <Badge variant="default" className="gap-1">
                                                    <CheckCircle2 className="h-3 w-3"/>
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <XCircle className="h-3 w-3"/>
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 flex-1 flex flex-col">
                                {isConfigured ? (
                                    <>
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm font-medium">Active Status</span>
                                            <Switch
                                                checked={integration.is_active}
                                                onCheckedChange={(checked) =>
                                                    updateStatusMutation.mutate({
                                                        id: integration.id,
                                                        is_active: checked
                                                    })
                                                }
                                                disabled={!integration.is_verified || updateStatusMutation.isPending}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 mt-auto">
                                            <div className="flex gap-2">
                                                {!integration.is_verified && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => setVerifyingIntegration(integration)}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </div>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleDelete(integration.id, integration.title)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        className="w-full mt-auto"
                                        onClick={() => handleSetupOrEdit(integration)}
                                    >
                                        Setup Integration
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <IntegrationFormDialog
                type={selectedIntegration?.id === null ? selectedIntegration.type : null}
                integration={selectedIntegration}
                open={!!selectedIntegration}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedIntegration(null)
                    }
                }}
                onSuccess={(integration) => {
                    setSelectedIntegration(null)
                    if (!integration.is_verified) {
                        setVerifyingIntegration(integration)
                    }
                }}
            />

            <VerifyOtp
                integration={verifyingIntegration}
                open={!!verifyingIntegration}
                onOpenChange={(open) => {
                    if (!open) setVerifyingIntegration(null)
                }}
                onSuccess={() => {
                    setVerifyingIntegration(null)
                }}
            />
        </>
    )
}