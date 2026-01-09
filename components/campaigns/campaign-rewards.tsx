'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ArrowLeft, Search, Download, Gift, TrendingUp} from 'lucide-react'
import Link from 'next/link'

import type {Campaign} from '@/types/api'

interface CampaignRewardsProps {
    campaign: Campaign
}

export function CampaignRewards({campaign}: CampaignRewardsProps) {
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const stats = {
        totalIssued: campaign.total_rewards,
        totalRedeemed: campaign.rewards_redeemed,
        totalPending: campaign.rewards_pending,
    }

    const redemptionRate = stats.totalIssued > 0
        ? ((stats.totalRedeemed / stats.totalIssued) * 100).toFixed(1)
        : '0.0'

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
                        <h1 className='text-3xl font-bold tracking-tight'>Campaign Rewards</h1>
                        <p className='text-muted-foreground'>
                            {campaign.name} • {campaign.client_data?.company_data?.name || "No Client Name"}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Download className='mr-2 size-4'/>
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Issued</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.totalIssued.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Redeemed</CardTitle>
                        <Gift className='size-4 text-green-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-green-600'>
                            {stats.totalRedeemed.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending</CardTitle>
                        <Gift className='size-4 text-orange-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-orange-600'>
                            {stats.totalPending.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Redemption Rate</CardTitle>
                        <TrendingUp className='size-4 text-blue-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-blue-600'>{redemptionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Rewards Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Reward Distribution</CardTitle>
                    <CardDescription>Overview of all rewards in this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='text-center py-12'>
                        <p className='text-muted-foreground'>
                            Reward breakdown will be displayed here. API integration pending.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Redemptions */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Recent Reward Activity</CardTitle>
                            <CardDescription>Latest reward issuances and redemptions</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={statusFilter} onValueChange={setStatusFilter} className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='redeemed'>Redeemed</TabsTrigger>
                                <TabsTrigger value='pending'>Pending</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input
                                        placeholder='Search rewards...'
                                        className='pl-8 w-[250px]'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <TabsContent value={statusFilter}>
                            <div className='text-center py-12'>
                                <p className='text-muted-foreground'>
                                    Reward activity will be displayed here. API integration pending.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
