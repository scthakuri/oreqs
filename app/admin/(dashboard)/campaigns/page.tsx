'use client'

import {useState, useMemo, useCallback} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Badge} from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Megaphone, Plus, Search, MoreHorizontal, Loader2, ChevronLeft, ChevronRight, Scan, Gift} from 'lucide-react'
import {toast} from 'sonner'
import {campaignsApi} from '@/lib/api/campaigns'
import {clientsApi} from '@/lib/api/clients'
import type {Campaign} from '@/types/api'
import {usePermissions} from '@/hooks/use-permissions'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'

const Page = () => {
    const {getCRUDPermissions} = usePermissions()
    const permissions = getCRUDPermissions('campaigns')
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [clientFilter, setClientFilter] = useState<string>('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null)

    const {data: campaignsData, isLoading, refetch} = useQuery({
        queryKey: ['campaigns', searchQuery, page, statusFilter, clientFilter],
        queryFn: () => campaignsApi.list({
            search: searchQuery || undefined,
            ordering: '-created_at',
            page: page,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            client: clientFilter !== 'all' ? parseInt(clientFilter) : undefined,
        }),
    })

    const {data: statsData} = useQuery({
        queryKey: ['campaigns', 'stats'],
        queryFn: () => campaignsApi.stats(),
    })

    const {data: clientsData} = useQuery({
        queryKey: ['clients', 'active'],
        queryFn: () => clientsApi.list({is_active: true, ordering: 'created_at'}),
    })

    const campaigns = campaignsData?.results || []
    const totalCampaigns = campaignsData?.count || 0
    const totalPages = campaignsData?.total_pages || 0
    const currentPage = campaignsData?.current_page || 1
    const stats = statsData || {total: 0, active: 0, paused: 0, completed: 0, draft: 0, cancelled: 0}
    const clients = clientsData?.results || []

    const totalStats = useMemo(
        () =>
            campaigns.reduce(
                (acc, campaign) => ({
                    scans: acc.scans + campaign.total_scans,
                    rewards: acc.rewards + campaign.total_rewards,
                }),
                {scans: 0, rewards: 0}
            ),
        [campaigns]
    )

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: (id: number) => campaignsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            toast.success(`${deletingCampaign?.name} has been deleted`)
            void refetch()
            setShowDeleteDialog(false)
            setDeletingCampaign(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete campaign:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete campaign'
            toast.error(message)
        }
    })

    const handleDeleteClick = useCallback((campaign: Campaign) => {
        if (campaign.total_scans > 0 || campaign.total_rewards > 0) {
            toast.error('Cannot delete campaign with activity', {
                description: `This campaign has ${campaign.total_scans} scans and ${campaign.total_rewards} rewards issued.`
            })
            return
        }
        setDeletingCampaign(campaign)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingCampaign) return
        deleteMutation.mutate(deletingCampaign.id)
    }, [deletingCampaign, deleteMutation])

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default'
            case 'paused':
                return 'secondary'
            case 'completed':
                return 'outline'
            case 'draft':
                return 'outline'
            case 'cancelled':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Megaphone className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Campaigns Overview</h1>
                    <p className='text-muted-foreground'>Monitor all campaigns across clients and countries</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Megaphone className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.total}</div>
                        <p className='text-xs text-muted-foreground'>
                            {stats.active} active, {stats.paused} paused
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <Scan className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.scans.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Across all campaigns</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Rewards Issued</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.rewards.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Total rewards</p>
                    </CardContent>
                </Card>
            </div>

            {/* Campaigns Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Campaigns</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${campaigns.length} campaigns` : `Showing ${campaigns.length} campaigns`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search campaigns...'
                                    className='pl-8 w-62.5'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className='w-32.5'>
                                    <SelectValue placeholder='Status'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Status</SelectItem>
                                    <SelectItem value='active'>Active</SelectItem>
                                    <SelectItem value='paused'>Paused</SelectItem>
                                    <SelectItem value='completed'>Completed</SelectItem>
                                    <SelectItem value='draft'>Draft</SelectItem>
                                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={clientFilter} onValueChange={setClientFilter}>
                                <SelectTrigger className='w-37.5'>
                                    <SelectValue placeholder='Client'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Clients</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.user.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {permissions.canCreate && (
                                <Link href='/admin/campaigns/new'>
                                    <Button>
                                        <Plus className='mr-2 size-4'/>
                                        Create Campaign
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign Name</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead className='text-right'>Scans</TableHead>
                                <TableHead className='text-right'>Rewards</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                {(permissions.canUpdate || permissions.canDelete) && (
                                    <TableHead className='text-right'>Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center py-8'>
                                        <Loader2 className='size-6 animate-spin mx-auto text-muted-foreground'/>
                                    </TableCell>
                                </TableRow>
                            ) : campaigns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No campaigns found matching your search' : 'No campaigns available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>{campaign.name}</span>
                                                <span className='text-sm text-muted-foreground'>
                                                    {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{campaign.client_data?.user.full_name || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{campaign.branch_data?.branch_name || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell className='text-right'>{campaign.total_scans.toLocaleString()}</TableCell>
                                        <TableCell className='text-right'>{campaign.total_rewards.toLocaleString()}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={getStatusBadgeVariant(campaign.status)}>
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        {(permissions.canUpdate || permissions.canDelete) && (
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='icon'>
                                                            <MoreHorizontal className='size-4'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/campaigns/${campaign.id}`}>
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {permissions.canUpdate && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                                                                    Edit Campaign
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {permissions.canDelete && (
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleDeleteClick(campaign)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-6 py-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            Page {currentPage} of {totalPages} ({totalCampaigns} total campaigns)
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronLeft className='size-4 mr-1'/>
                                Previous
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || isLoading}
                            >
                                Next
                                <ChevronRight className='size-4 ml-1'/>
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {deletingCampaign?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingCampaign(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Campaign
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page