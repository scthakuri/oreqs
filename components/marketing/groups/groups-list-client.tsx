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
import {Users, Plus, Search, MoreHorizontal, Loader2, ChevronLeft, ChevronRight} from 'lucide-react'
import {toast} from 'sonner'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'
import {groupsApi} from "@/lib/api/marketing/groups"
import {Group} from "@/types/marketing/group"

export function GroupsListClient() {
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)

    const {data: groupsData, isLoading} = useQuery({
        queryKey: ['groups', searchQuery, page],
        queryFn: () => groupsApi.list({
            search: searchQuery || undefined,
            ordering: '-created_at',
            page: page,
        }),
    })

    const groups = groupsData?.results || []
    const totalGroups = groupsData?.count || 0
    const totalPages = Math.ceil(totalGroups / 10)

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const deleteMutation = useMutation({
        mutationFn: (id: number) => groupsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['groups']})
            toast.success(`${deletingGroup?.name} has been deleted`)
            setShowDeleteDialog(false)
            setDeletingGroup(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete group:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete group'
            toast.error(message)
        }
    })

    const handleDeleteClick = useCallback((group: Group) => {
        setDeletingGroup(group)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingGroup) return
        deleteMutation.mutate(deletingGroup.id)
    }, [deletingGroup, deleteMutation])

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Users className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Groups Management</h1>
                    <p className='text-muted-foreground'>Organize marketing users into groups</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Groups</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${groups.length} groups` : `Showing ${groups.length} of ${totalGroups} groups`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search groups...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Link href='/admin/marketing/groups/new'>
                                <Button>
                                    <Plus className='mr-2 size-4'/>
                                    Add Group
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Group Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className='text-right'>Members</TableHead>
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
                            ) : groups.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No groups found matching your search' : 'No groups available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groups.map((group) => (
                                    <TableRow key={group.id}>
                                        <TableCell>
                                            <span className='font-medium'>{group.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm text-muted-foreground'>
                                                {group.description || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='text-sm'>{group.created_by_name || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>{group.member_count}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={group.is_active ? 'default' : 'secondary'}>
                                                {group.is_active ? 'Active' : 'Inactive'}
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
                                                        <Link href={`/admin/marketing/groups/${group.id}`}>
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/marketing/groups/${group.id}/edit`}>
                                                            Edit Group
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className='text-destructive'
                                                        onClick={() => handleDeleteClick(group)}
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
                            Page {page} of {totalPages} ({totalGroups} total groups)
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
                            This will permanently delete {deletingGroup?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingGroup(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Group
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
