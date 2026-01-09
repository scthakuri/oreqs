'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ArrowLeft, TrendingUp, TrendingDown, Download} from 'lucide-react'
import Link from 'next/link'

import type {Campaign} from '@/types/api'

interface CampaignAnalyticsProps {
    campaign: Campaign
}

export function CampaignAnalytics({campaign}: CampaignAnalyticsProps) {
    const stats = [
        {
            title: 'Total Scans',
            value: campaign.total_scans.toLocaleString(),
            change: '+0%',
            trend: 'up',
            description: 'vs last period',
        },
        {
            title: 'Conversion Rate',
            value: campaign.total_scans > 0
                ? `${((campaign.total_rewards / campaign.total_scans) * 100).toFixed(1)}%`
                : '0%',
            change: '+0%',
            trend: 'up',
            description: 'rewards issued',
        },
        {
            title: 'Redemption Rate',
            value: campaign.total_rewards > 0
                ? `${((campaign.rewards_redeemed / campaign.total_rewards) * 100).toFixed(1)}%`
                : '0%',
            change: '+0%',
            trend: 'up',
            description: 'of issued rewards',
        },
        {
            title: 'Pending Rewards',
            value: campaign.rewards_pending.toLocaleString(),
            change: `${campaign.rewards_pending} pending`,
            trend: 'up',
            description: 'awaiting redemption',
        },
    ]

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'default',
            completed: 'secondary',
            paused: 'destructive',
            draft: 'outline',
            scheduled: 'secondary',
            cancelled: 'destructive',
        } as const
        return variants[status as keyof typeof variants] || 'outline'
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href={`/admin/campaigns/${campaign.id}`}>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Campaign Analytics</h1>
                        <p className='text-muted-foreground'>
                            {campaign.name} • {campaign.client_data?.company_data?.name || "No Client"}
                        </p>
                    </div>
                    <Badge variant={getStatusBadge(campaign.status)}>
                        {campaign.status_display}
                    </Badge>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Download className='mr-2 size-4'/>
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            {stat.trend === 'up' ? (
                                <TrendingUp className='size-4 text-green-600'/>
                            ) : (
                                <TrendingDown className='size-4 text-red-600'/>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground'>
                                <span
                                    className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                                >
                                    {stat.change}
                                </span>
                                {' '}{stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <Tabs defaultValue='overview' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='performance'>Performance</TabsTrigger>
                    <TabsTrigger value='rewards'>Rewards</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Performance</CardTitle>
                            <CardDescription>Overview of campaign metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-center py-12'>
                                <p className='text-muted-foreground'>
                                    Analytics charts will be displayed here. API integration pending.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='performance' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Detailed performance breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-center py-12'>
                                <p className='text-muted-foreground'>
                                    Performance charts will be displayed here. API integration pending.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='rewards' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Analytics</CardTitle>
                            <CardDescription>Reward distribution and trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-center py-12'>
                                <p className='text-muted-foreground'>
                                    Reward analytics will be displayed here. API integration pending.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Summary Cards */}
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Summary</CardTitle>
                        <CardDescription>Key metrics at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Total Scans</p>
                                    <p className='text-xl font-bold'>{campaign.total_scans.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Total Rewards</p>
                                    <p className='text-xl font-bold'>{campaign.total_rewards.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Redeemed</p>
                                    <p className='text-xl font-bold text-green-600'>
                                        {campaign.rewards_redeemed.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Pending</p>
                                    <p className='text-xl font-bold text-orange-600'>
                                        {campaign.rewards_pending.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Type</CardTitle>
                        <CardDescription>Campaign configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div>
                                <p className='text-sm text-muted-foreground'>Type</p>
                                <Badge variant='secondary' className='mt-1'>
                                    {campaign.campaign_type_display}
                                </Badge>
                            </div>
                            <div>
                                <p className='text-sm text-muted-foreground'>Status</p>
                                <Badge variant={getStatusBadge(campaign.status)} className='mt-1'>
                                    {campaign.status_display}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
