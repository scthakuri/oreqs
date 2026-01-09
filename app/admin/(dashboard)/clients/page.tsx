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
import {Building2, Plus, Search, MoreHorizontal, Loader2, ChevronLeft, ChevronRight, Store, Megaphone} from 'lucide-react'
import {toast} from 'sonner'
import {clientsApi} from '@/lib/api/clients'
import {dealersApi} from '@/lib/api/dealers'
import type {Client} from '@/types/api'
import {usePermissions} from '@/hooks/use-permissions'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'

const Page = () => {
    const {getCRUDPermissions} = usePermissions()
    const permissions = getCRUDPermissions('clients')
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [dealerFilter, setDealerFilter] = useState<string>('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingClient, setDeletingClient] = useState<Client | null>(null)

    const {data: clientsData, isLoading, refetch} = useQuery({
        queryKey: ['clients', searchQuery, page, dealerFilter],
        queryFn: () => clientsApi.list({
            search: searchQuery || undefined,
            ordering: '-created_at',
            page: page,
            dealer: dealerFilter !== 'all' ? parseInt(dealerFilter) : undefined,
        }),
    })

    const {data: dealersData} = useQuery({
        queryKey: ['dealers', 'active'],
        queryFn: () => dealersApi.list({is_active: true, ordering: 'created_at'}),
    })

    const clients = clientsData?.results || []
    const totalClients = clientsData?.count || 0
    const totalPages = clientsData?.total_pages || 0
    const currentPage = clientsData?.current_page || 1
    const dealers = dealersData?.results || []

    const totalStats = useMemo(
        () =>
            clients.reduce(
                (acc, client) => ({
                    branches: acc.branches + client.branches_count,
                    campaigns: acc.campaigns + client.campaigns_count,
                }),
                {branches: 0, campaigns: 0}
            ),
        [clients]
    )

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: (id: number) => clientsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['clients']})
            toast.success(`${deletingClient?.user.full_name} has been deleted`)
            void refetch()
            setShowDeleteDialog(false)
            setDeletingClient(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete client:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete client'
            toast.error(message)
        }
    })

    const handleDeleteClick = useCallback((client: Client) => {
        if (client.branches_count > 0 || client.campaigns_count > 0) {
            toast.error('Cannot delete client with active records', {
                description: `This client has ${client.branches_count} branches and ${client.campaigns_count} campaigns.`
            })
            return
        }
        setDeletingClient(client)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingClient) return
        deleteMutation.mutate(deletingClient.id)
    }, [deletingClient, deleteMutation])

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Building2 className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Clients Management</h1>
                    <p className='text-muted-foreground'>Manage clients across all dealers</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalClients}</div>
                        <p className='text-xs text-muted-foreground'>Across all dealers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Branches</CardTitle>
                        <Store className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.branches}</div>
                        <p className='text-xs text-muted-foreground'>Under all clients</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Megaphone className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.campaigns}</div>
                        <p className='text-xs text-muted-foreground'>Active campaigns</p>
                    </CardContent>
                </Card>
            </div>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Clients</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${clients.length} clients` : `Showing ${clients.length} clients`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search clients...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Select value={dealerFilter} onValueChange={setDealerFilter}>
                                <SelectTrigger className='w-[150px]'>
                                    <SelectValue placeholder='Dealer'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Dealers</SelectItem>
                                    {dealers.map((dealer) => (
                                        <SelectItem key={dealer.id} value={dealer.id.toString()}>
                                            {dealer.user.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {permissions.canCreate && (
                                <Link href='/admin/clients/new'>
                                    <Button>
                                        <Plus className='mr-2 size-4'/>
                                        Add Client
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
                                <TableHead>Client</TableHead>
                                <TableHead>Dealer</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead className='text-right'>Branches</TableHead>
                                <TableHead className='text-right'>Campaigns</TableHead>
                                <TableHead className='text-right'>Subscription</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                {(permissions.canUpdate || permissions.canDelete) && (
                                    <TableHead className='text-right'>Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center py-8'>
                                        <Loader2 className='size-6 animate-spin mx-auto text-muted-foreground'/>
                                    </TableCell>
                                </TableRow>
                            ) : clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No clients found matching your search' : 'No clients available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>{client.user.full_name}</span>
                                                <span className='text-sm text-muted-foreground'>{client.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{client.dealer_data.user.full_name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-2'>
                                                <Badge variant='outline'>{client.country_data.code}</Badge>
                                                <span className='text-sm'>{client.country_data.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>{client.branches_count}</TableCell>
                                        <TableCell className='text-right'>{client.campaigns_count}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge
                                                variant={
                                                    client.subscription_plan === 'premium' ? 'default' :
                                                    client.subscription_plan === 'lifetime' ? 'secondary' :
                                                    'outline'
                                                }
                                            >
                                                {client.subscription_plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={client.is_active ? 'default' : 'secondary'}>
                                                {client.is_active ? 'Active' : 'Inactive'}
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
                                                            <Link href={`/admin/clients/${client.id}`}>
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {permissions.canUpdate && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/clients/${client.id}/edit`}>
                                                                    Edit Client
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {permissions.canDelete && (
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleDeleteClick(client)}
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
                            Page {currentPage} of {totalPages} ({totalClients} total clients)
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
                            This will permanently delete {deletingClient?.user.full_name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingClient(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Client
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
