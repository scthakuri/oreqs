'use client'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {ArrowLeft, Calendar, QrCode, Gift, TrendingUp, Eye, Pause, Play} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'
import {format} from 'date-fns'

import type {Campaign} from '@/types/api'
import {campaignsApi} from '@/lib/api/campaigns'
import Image from "next/image";
import CampaignQr from "@/components/campaigns/campaign-qr";

interface CampaignDetailProps {
    campaign: Campaign
}

export function CampaignDetail({campaign}: CampaignDetailProps) {
    const queryClient = useQueryClient()

    const pauseMutation = useMutation({
        mutationFn: () => campaignsApi.pause(campaign.id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
        onError: () => {
            toast.error('Failed to pause campaign')
        },
    })

    const resumeMutation = useMutation({
        mutationFn: () => campaignsApi.resume(campaign.id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
        onError: () => {
            toast.error('Failed to resume campaign')
        },
    })

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
                    <Link href='/admin/campaigns'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{campaign.name}</h1>
                        <p className='text-muted-foreground'>
                            {campaign.client_data.company_data?.name || 'No Company'}
                            {campaign.country_data && ` • ${campaign.country_data.name}`}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    {campaign.status === 'active' ? (
                        <Button
                            variant='outline'
                            onClick={() => pauseMutation.mutate()}
                            disabled={pauseMutation.isPending}
                        >
                            <Pause className='mr-2 size-4'/>
                            Pause Campaign
                        </Button>
                    ) : campaign.status === 'paused' ? (
                        <Button
                            variant='outline'
                            onClick={() => resumeMutation.mutate()}
                            disabled={resumeMutation.isPending}
                        >
                            <Play className='mr-2 size-4'/>
                            Resume Campaign
                        </Button>
                    ) : null}
                    <Link href={`/admin/campaigns/${campaign.id}/analytics`}>
                        <Button variant='outline'>
                            <TrendingUp className='mr-2 size-4'/>
                            View Analytics
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <Eye className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.total_scans.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Rewards Issued</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.total_rewards.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>
                            {campaign.rewards_redeemed} redeemed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending Rewards</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.rewards_pending.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Awaiting redemption</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Status</CardTitle>
                        <TrendingUp className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={getStatusBadge(campaign.status)} className='text-lg'>
                            {campaign.status_display}
                        </Badge>
                        <p className='text-xs text-muted-foreground mt-2'>Current status</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Link href={`/admin/campaigns/${campaign.id}/scans`} className='block'>
                    <Card className='cursor-pointer hover:bg-muted/50 transition-colors h-full'>
                        <CardHeader>
                            <CardTitle className='text-base flex items-center gap-2'>
                                <Eye className='size-4' />
                                View All Scans
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                Complete scan history
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href={`/admin/campaigns/${campaign.id}/rewards`} className='block'>
                    <Card className='cursor-pointer hover:bg-muted/50 transition-colors h-full'>
                        <CardHeader>
                            <CardTitle className='text-base flex items-center gap-2'>
                                <Gift className='size-4' />
                                View All Rewards
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                Rewards breakdown
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href={`/admin/campaigns/${campaign.id}/analytics`} className='block'>
                    <Card className='cursor-pointer hover:bg-muted/50 transition-colors h-full'>
                        <CardHeader>
                            <CardTitle className='text-base flex items-center gap-2'>
                                <TrendingUp className='size-4' />
                                Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                Performance insights
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href={`/admin/campaigns/${campaign.id}/edit`} className='block'>
                    <Card className='cursor-pointer hover:bg-muted/50 transition-colors h-full'>
                        <CardHeader>
                            <CardTitle className='text-base flex items-center gap-2'>
                                <Calendar className='size-4' />
                                Edit Campaign
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                Update settings
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Details Section - 3 Columns */}
            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Left Column */}
                <div className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Information</CardTitle>
                            <CardDescription>Basic campaign details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm font-medium mb-2'>Campaign Type</p>
                                <Badge variant='secondary' className='text-sm'>
                                    {campaign.campaign_type_display}
                                </Badge>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium mb-2'>Start Date</p>
                                <p className='text-sm text-muted-foreground'>
                                    {format(new Date(campaign.start_date), 'PPP')}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium mb-2'>End Date</p>
                                <p className='text-sm text-muted-foreground'>
                                    {format(new Date(campaign.end_date), 'PPP')}
                                </p>
                            </div>
                            {campaign.description && (
                                <>
                                    <Separator/>
                                    <div>
                                        <p className='text-sm font-medium mb-2'>Description</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {campaign.description}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Client Details</CardTitle>
                            <CardDescription>Business information</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm font-medium mb-2'>Business Name</p>
                                <p className='text-sm text-muted-foreground'>
                                    {campaign.client_data.company_data?.name || "N/A"}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium mb-2'>Contact</p>
                                <p className='text-sm text-muted-foreground'>
                                    {campaign.client_data.user.email}
                                </p>
                            </div>
                            {campaign.country_data && (
                                <>
                                    <Separator/>
                                    <div>
                                        <p className='text-sm font-medium mb-2'>Country</p>
                                        <div className='flex items-center gap-2'>
                                            <Badge variant='outline'>{campaign.country_data.code}</Badge>
                                            <span className='text-sm text-muted-foreground'>
                                                {campaign.country_data.name}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                            <Separator/>
                            <Link href={`/clients/${campaign.client_data.id}`}>
                                <Button variant='outline' className='w-full'>
                                    View Client Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className='space-y-6'>
                    <CampaignQr
                        qr_image={campaign.qr_image}
                        campaign_id={campaign.id}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance</CardTitle>
                            <CardDescription>Key metrics</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm text-muted-foreground mb-1'>Conversion Rate</p>
                                <p className='text-2xl font-bold'>
                                    {campaign.total_scans > 0
                                        ? `${((campaign.total_rewards / campaign.total_scans) * 100).toFixed(1)}%`
                                        : '0%'}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm text-muted-foreground mb-1'>Redemption Rate</p>
                                <p className='text-2xl font-bold'>
                                    {campaign.total_rewards > 0
                                        ? `${((campaign.rewards_redeemed / campaign.total_rewards) * 100).toFixed(1)}%`
                                        : '0%'}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm text-muted-foreground mb-1'>Branches</p>
                                <p className='text-2xl font-bold'>
                                    {campaign.applies_to_all_branches ? 'All' : 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest scans and rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-center py-12'>
                            <Eye className='size-12 text-muted-foreground mx-auto mb-4' />
                            <p className='text-sm font-medium mb-2'>No Recent Activity</p>
                            <p className='text-xs text-muted-foreground'>
                                Activity data will appear here
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
