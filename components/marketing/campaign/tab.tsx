'use client'

import {useState} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Plus, Search} from 'lucide-react'
import {toast} from 'sonner'
import {campaignsApi} from '@/lib/api/marketing/campaign'
import type {Campaign, Template} from '@/types/marketing/campaign'
import CampaignsTable from "@/components/marketing/campaign/table"
import CreateCampaignDialog from "@/components/marketing/campaign/create-campaign-dialog"

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification'

interface CampaignsTabProps {
    campaignType: CampaignType
    campaigns: Campaign[]
    templates: Template[]
    isLoading: boolean
}

const campaignTypeLabels = {
    email: {title: 'Email Campaigns', description: 'Manage your email marketing campaigns'},
    sms: {title: 'SMS Campaigns', description: 'Manage your SMS marketing campaigns'},
    whatsapp: {title: 'WhatsApp Campaigns', description: 'Manage your WhatsApp marketing campaigns'},
    push_notification: {title: 'Push Notification Campaigns', description: 'Manage your push notification campaigns'},
}

const CampaignsTab = ({campaignType, campaigns, templates, isLoading}: CampaignsTabProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [showNewCampaign, setShowNewCampaign] = useState(false)
    const queryClient = useQueryClient()
    const labels = campaignTypeLabels[campaignType]

    const deleteMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.delete(campaignType, id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['campaigns', campaignType]})
            await queryClient.refetchQueries({queryKey: ['campaigns', campaignType]})
            toast.success('Campaign deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete campaign')
        },
    })

    const sendMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.send(campaignType, id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns', campaignType]})
            await queryClient.refetchQueries({queryKey: ['campaigns', campaignType]})
            toast.success(data.message)
        },
        onError: () => {
            toast.error('Failed to send campaign')
        },
    })

    const pauseMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.pause(campaignType, id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns', campaignType]})
            await queryClient.refetchQueries({queryKey: ['campaigns', campaignType]})
            toast.success(data.message)
        },
        onError: () => {
            toast.error('Failed to pause campaign')
        },
    })

    const cancelMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.cancel(campaignType, id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns', campaignType]})
            await queryClient.refetchQueries({queryKey: ['campaigns', campaignType]})
            toast.success(data.message)
        },
        onError: () => {
            toast.error('Failed to cancel campaign')
        },
    })

    const filteredCampaigns = campaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleSend = (id: number) => {
        if (confirm('Are you sure you want to send this campaign?')) {
            sendMutation.mutate(id)
        }
    }

    const handlePause = (id: number) => {
        pauseMutation.mutate(id)
    }

    const handleCancel = (id: number) => {
        if (confirm('Are you sure you want to cancel this campaign?')) {
            cancelMutation.mutate(id)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>{labels.title}</CardTitle>
                        <CardDescription>{labels.description}</CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search campaigns...'
                                className='pl-8 w-[250px]'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowNewCampaign(true)}>
                            <Plus className='mr-2 size-4'/>
                            New Campaign
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CampaignsTable
                    campaigns={filteredCampaigns}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onSend={handleSend}
                    onPause={handlePause}
                    onCancel={handleCancel}
                />
            </CardContent>

            <CreateCampaignDialog
                campaignType={campaignType}
                open={showNewCampaign}
                onOpenChange={setShowNewCampaign}
                templates={templates}
            />
        </Card>
    )
}

export default CampaignsTab