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
import {Users, Plus, Search, MoreHorizontal, Loader2, ChevronLeft, ChevronRight, Building2, DollarSign} from 'lucide-react'
import {toast} from 'sonner'
import {dealersApi} from '@/lib/api/dealers'
import {countriesApi} from '@/lib/api/countries'
import type {Dealer} from '@/types/api'
import {usePermissions} from '@/hooks/use-permissions'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

const Page = () => {
    const {getCRUDPermissions} = usePermissions()
    const permissions = getCRUDPermissions('dealers')
    const queryClient = useQueryClient()
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [countryFilter, setCountryFilter] = useState<string>('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingDealer, setDeletingDealer] = useState<Dealer | null>(null)

    const {data: dealersData, isLoading, refetch} = useQuery({
        queryKey: ['dealers', searchQuery, page, countryFilter],
        queryFn: () => dealersApi.list({
            search: searchQuery || undefined,
            ordering: '-created_at',
            page: page,
            country: countryFilter !== 'all' ? parseInt(countryFilter) : undefined,
        }),
    })

    const {data: countriesData} = useQuery({
        queryKey: ['countries', 'active'],
        queryFn: () => countriesApi.list({is_active: true, ordering: 'name'}),
    })

    const dealers = dealersData?.results || []
    const totalDealers = dealersData?.count || 0
    const totalPages = dealersData?.total_pages || 0
    const currentPage = dealersData?.current_page || 1
    const countries = countriesData?.results || []

    const totalStats = useMemo(
        () =>
            dealers.reduce(
                (acc, dealer) => ({
                    clients: acc.clients + dealer.clients_count,
                    campaigns: acc.campaigns + dealer.campaigns_count,
                }),
                {clients: 0, campaigns: 0}
            ),
        [dealers]
    )

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: (id: number) => dealersApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['dealers']})
            toast.success(`${deletingDealer?.user.full_name} has been deleted`)
            void refetch()
            setShowDeleteDialog(false)
            setDeletingDealer(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete dealer:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete dealer'
            toast.error(message)
        }
    })

    const handleDeleteClick = useCallback((dealer: Dealer) => {
        if (dealer.clients_count > 0 || dealer.campaigns_count > 0) {
            toast.error('Cannot delete dealer with active records', {
                description: `This dealer has ${dealer.clients_count} clients and ${dealer.campaigns_count} campaigns.`
            })
            return
        }
        setDeletingDealer(dealer)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingDealer) return
        deleteMutation.mutate(deletingDealer.id)
    }, [deletingDealer, deleteMutation])

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Users className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Dealers Management</h1>
                    <p className='text-muted-foreground'>Manage dealers across all countries</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Dealers</CardTitle>
                        <Users className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalDealers}</div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.clients}</div>
                        <p className='text-xs text-muted-foreground'>Under all dealers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <DollarSign className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.campaigns}</div>
                        <p className='text-xs text-muted-foreground'>Active campaigns</p>
                    </CardContent>
                </Card>
            </div>

            {/* Dealers Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Dealers</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${dealers.length} dealers` : `Showing ${dealers.length} dealers`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search dealers...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Select value={countryFilter} onValueChange={setCountryFilter}>
                                <SelectTrigger className='w-[150px]'>
                                    <SelectValue placeholder='Country'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Countries</SelectItem>
                                    {countries.map((country) => (
                                        <SelectItem key={country.id} value={country.id.toString()}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {permissions.canCreate && (
                                <Link href='/admin/dealers/new'>
                                    <Button>
                                        <Plus className='mr-2 size-4'/>
                                        Add Dealer
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
                                <TableHead>Dealer</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead className='text-right'>Clients</TableHead>
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
                                    <TableCell colSpan={7} className='text-center py-8'>
                                        <Loader2 className='size-6 animate-spin mx-auto text-muted-foreground'/>
                                    </TableCell>
                                </TableRow>
                            ) : dealers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No dealers found matching your search' : 'No dealers available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dealers.map((dealer) => (
                                    <TableRow key={dealer.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>{dealer.user.full_name}</span>
                                                <span className='text-sm text-muted-foreground'>{dealer.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-2'>
                                                <Badge variant='outline'>{dealer.country_data.code}</Badge>
                                                <span className='text-sm'>{dealer.country_data.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>{dealer.clients_count}</TableCell>
                                        <TableCell className='text-right'>{dealer.campaigns_count}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={dealer.subscription_plan === 'premium' ? 'default' : 'secondary'}>
                                                {dealer.subscription_plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={dealer.is_active ? 'default' : 'secondary'}>
                                                {dealer.is_active ? 'Active' : 'Inactive'}
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
                                                            <Link href={`/admin/dealers/${dealer.id}`}>
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {permissions.canUpdate && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/dealers/${dealer.id}/edit`}>
                                                                    Edit Dealer
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {permissions.canDelete && (
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleDeleteClick(dealer)}
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
                            Page {currentPage} of {totalPages} ({totalDealers} total dealers)
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
                            This will permanently delete {deletingDealer?.user.full_name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingDealer(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Dealer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
