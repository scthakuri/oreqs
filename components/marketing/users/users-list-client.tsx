'use client'

import {useState, useCallback} from 'react'
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
import {Users2, Plus, Search, MoreHorizontal, Loader2, ChevronLeft, ChevronRight, Upload} from 'lucide-react'
import {toast} from 'sonner'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'
import {MarketingUser, marketingUsersApi} from "@/lib/api/marketing/users"
import {ImportUsersDialog} from './import-users-dialog'

export function UsersListClient() {
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingUser, setDeletingUser] = useState<MarketingUser | null>(null)
    const [showImportDialog, setShowImportDialog] = useState(false)

    const {data: usersData, isLoading} = useQuery({
        queryKey: ['marketing-users', searchQuery, page],
        queryFn: () => marketingUsersApi.list({
            search: searchQuery || undefined,
            ordering: '-date_joined',
            page: page,
        }),
    })

    const {data: stats} = useQuery({
        queryKey: ['marketing-stats'],
        queryFn: () => marketingUsersApi.stats(),
    })

    const users = usersData?.results || []
    const totalUsers = usersData?.count || 0
    const totalPages = Math.ceil(totalUsers / 10)

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: (id: number) => marketingUsersApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['marketing-users']})
            await queryClient.invalidateQueries({queryKey: ['marketing-stats']})
            toast.success(`${deletingUser?.full_name} has been deleted`)
            setShowDeleteDialog(false)
            setDeletingUser(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete user:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete user'
            toast.error(message)
        }
    })

    const handleDeleteClick = useCallback((user: MarketingUser) => {
        setDeletingUser(user)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingUser) return
        deleteMutation.mutate(deletingUser.id)
    }, [deletingUser, deleteMutation])

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Users2 className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Marketing Users</h1>
                    <p className='text-muted-foreground'>Manage all marketing contacts</p>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
                        <Users2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats?.total_users || 0}</div>
                        <p className='text-xs text-muted-foreground'>Marketing contacts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Groups</CardTitle>
                        <Users2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats?.total_groups || 0}</div>
                        <p className='text-xs text-muted-foreground'>Organized groups</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${users.length} users` : `Showing ${users.length} of ${totalUsers} users`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search users...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                variant='outline'
                                onClick={() => setShowImportDialog(true)}
                            >
                                <Upload className='mr-2 size-4'/>
                                Import
                            </Button>
                            <Link href='/admin/marketing/users/new'>
                                <Button>
                                    <Plus className='mr-2 size-4'/>
                                    Add User
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className='text-right'>Groups</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8'>
                                        <Loader2 className='size-6 animate-spin mx-auto text-muted-foreground'/>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No users found matching your search' : 'No users available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <span className='font-medium'>{user.full_name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{user.email || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{user.phone || '-'}</span>
                                        </TableCell>
                                        <TableCell className='text-right'>{user.groups.length}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon'>
                                                        <MoreHorizontal className='size-4'/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/marketing/users/${user.id}/edit`}>
                                                            Edit User
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className='text-destructive'
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-6 py-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            Page {page} of {totalPages} ({totalUsers} total users)
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                            >
                                <ChevronLeft className='size-4 mr-1'/>
                                Previous
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || isLoading}
                            >
                                Next
                                <ChevronRight className='size-4 ml-1'/>
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {deletingUser?.full_name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingUser(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ImportUsersDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
            />
        </div>
    )
}
