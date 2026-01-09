'use client'

import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Search, MoreHorizontal, Eye, Pause, Play, CheckCircle, X} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import {campaignsApi} from '@/lib/api/campaigns'
import type {Campaign} from '@/types/api'
import {toast} from 'sonner'
import {format} from 'date-fns'

interface CampaignsListProps {
    initialCampaigns: Campaign[]
}

export function CampaignsList({initialCampaigns}: CampaignsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const queryClient = useQueryClient()

    const {data: campaignsData} = useQuery({
        queryKey: ['campaigns', statusFilter, searchQuery],
        queryFn: () => campaignsApi.list({
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: searchQuery || undefined,
        }),
        initialData: {
            count: initialCampaigns.length,
            next: null,
            previous: null,
            total_pages: 1,
            current_page: 1,
            page_size: 20,
            results: initialCampaigns,
        },
    })

    const activateMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.activate(id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
    })

    const pauseMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.pause(id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
    })

    const resumeMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.resume(id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
    })

    const completeMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.complete(id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
    })

    const cancelMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.cancel(id),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success(data.message)
        },
    })

    const campaigns = campaignsData?.results || []

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

    const renderCampaignActions = (campaign: Campaign) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='size-4'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/campaigns/${campaign.id}`}>
                            <Eye className='mr-2 size-4'/>
                            View Details
                        </Link>
                    </DropdownMenuItem>

                    {campaign.status === 'draft' && (
                        <DropdownMenuItem onClick={() => activateMutation.mutate(campaign.id)}>
                            <Play className='mr-2 size-4'/>
                            Activate
                        </DropdownMenuItem>
                    )}

                    {campaign.status === 'active' && (
                        <>
                            <DropdownMenuItem onClick={() => pauseMutation.mutate(campaign.id)}>
                                <Pause className='mr-2 size-4'/>
                                Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => completeMutation.mutate(campaign.id)}>
                                <CheckCircle className='mr-2 size-4'/>
                                Complete
                            </DropdownMenuItem>
                        </>
                    )}

                    {campaign.status === 'paused' && (
                        <>
                            <DropdownMenuItem onClick={() => resumeMutation.mutate(campaign.id)}>
                                <Play className='mr-2 size-4'/>
                                Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => completeMutation.mutate(campaign.id)}>
                                <CheckCircle className='mr-2 size-4'/>
                                Complete
                            </DropdownMenuItem>
                        </>
                    )}

                    {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
                        <DropdownMenuItem
                            onClick={() => cancelMutation.mutate(campaign.id)}
                            className='text-destructive'
                        >
                            <X className='mr-2 size-4'/>
                            Cancel
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>All Campaigns</CardTitle>
                        <CardDescription>View and monitor campaign performance</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <TabsList>
                            <TabsTrigger value='all'>All</TabsTrigger>
                            <TabsTrigger value='active'>Active</TabsTrigger>
                            <TabsTrigger value='paused'>Paused</TabsTrigger>
                            <TabsTrigger value='completed'>Completed</TabsTrigger>
                            <TabsTrigger value='draft'>Draft</TabsTrigger>
                        </TabsList>
                        <div className='relative'>
                            <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search campaigns...'
                                className='pl-8 w-[250px]'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value={statusFilter}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className='text-right'>Scans</TableHead>
                                    <TableHead className='text-right'>Rewards</TableHead>
                                    <TableHead className='text-right'>Pending</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                                            No campaigns found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{campaign.name}</span>
                                                    <span className='text-sm text-muted-foreground'>
                                                        {format(new Date(campaign.start_date), 'MMM d, yyyy')} -{' '}
                                                        {format(new Date(campaign.end_date), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='text-sm'>{campaign.client_data?.company_data?.name || "No Client Name"}</span>
                                                    {campaign.country_data && (
                                                        <Badge variant='outline' className='w-fit'>
                                                            {campaign.country_data.code}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>{campaign.campaign_type_display}</Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>{campaign.total_scans.toLocaleString()}</TableCell>
                                            <TableCell className='text-right'>{campaign.total_rewards.toLocaleString()}</TableCell>
                                            <TableCell className='text-right'>
                                                {campaign.rewards_pending > 0 ? (
                                                    <span className='font-medium text-orange-600'>
                                                        {campaign.rewards_pending.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className='text-muted-foreground'>0</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Badge variant={getStatusBadge(campaign.status)}>
                                                    {campaign.status_display}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {renderCampaignActions(campaign)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
