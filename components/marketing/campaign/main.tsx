'use client'

import {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Mail, MessageSquare, Send, Eye, MousePointerClick} from 'lucide-react'
import {campaignsApi, templatesApi} from '@/lib/api/marketing/campaign'
import CampaignsTab from "@/components/marketing/campaign/tab"
import TemplatesTab from "@/components/marketing/campaign/templates-tab"

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification'

interface MarketingMainProps {
    campaignType: CampaignType
}

const campaignTypeConfig = {
    email: {
        icon: Mail,
        title: 'Email Marketing',
        description: 'Create and manage email campaigns for your clients',
        sentLabel: 'Emails Sent',
    },
    sms: {
        icon: MessageSquare,
        title: 'SMS Marketing',
        description: 'Create and manage SMS campaigns for your clients',
        sentLabel: 'SMS Sent',
    },
    whatsapp: {
        icon: MessageSquare,
        title: 'WhatsApp Marketing',
        description: 'Create and manage WhatsApp campaigns for your clients',
        sentLabel: 'Messages Sent',
    },
    push_notification: {
        icon: Send,
        title: 'Push Notification Marketing',
        description: 'Create and manage push notification campaigns for your clients',
        sentLabel: 'Notifications Sent',
    },
}

const MarketingMain = ({campaignType}: MarketingMainProps) => {
    const [activeTab, setActiveTab] = useState('campaigns')
    const config = campaignTypeConfig[campaignType]
    const Icon = config.icon

    const {data: campaignsData, isLoading: campaignsLoading} = useQuery({
        queryKey: ['campaigns', campaignType],
        queryFn: () => campaignsApi.list(campaignType),
    })

    const {data: templatesData, isLoading: templatesLoading} = useQuery({
        queryKey: ['templates', campaignType],
        queryFn: () => templatesApi.list(campaignType),
    })

    const campaigns = campaignsData?.results || []
    const templates = templatesData?.results || []

    const totalSent = campaigns.reduce((sum, c) => sum + (c.report?.sent_count || 0), 0)
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.report?.opened_count || 0), 0)
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.report?.unique_opens || 0), 0)
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.report?.delivered_count || 0), 0)

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Icon className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>{config.title}</h1>
                    <p className='text-muted-foreground'>{config.description}</p>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Icon className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaigns.length}</div>
                        <p className='text-xs text-muted-foreground'>All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>{config.sentLabel}</CardTitle>
                        <Send className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalSent.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Open Rate</CardTitle>
                        <Eye className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : 0}%
                        </div>
                        <p className='text-xs text-muted-foreground'>{totalOpened.toLocaleString()} opened</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Click Rate</CardTitle>
                        <MousePointerClick className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : 0}%
                        </div>
                        <p className='text-xs text-muted-foreground'>{totalClicked.toLocaleString()} clicks</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value='campaigns'>Campaigns</TabsTrigger>
                    <TabsTrigger value='templates'>Templates</TabsTrigger>
                </TabsList>

                <TabsContent value='campaigns' className='space-y-4'>
                    <CampaignsTab
                        campaignType={campaignType}
                        campaigns={campaigns}
                        templates={templates}
                        isLoading={campaignsLoading}
                    />
                </TabsContent>

                <TabsContent value='templates' className='space-y-4'>
                    <TemplatesTab
                        campaignType={campaignType}
                        templates={templates}
                        isLoading={templatesLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MarketingMain