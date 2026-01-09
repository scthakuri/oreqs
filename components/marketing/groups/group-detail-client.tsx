'use client'

import {useState, useCallback} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {ArrowLeft, Loader2, UserPlus, UserMinus, Search, ChevronLeft, ChevronRight, Upload} from 'lucide-react'
import {toast} from 'sonner'
import Link from 'next/link'
import {Checkbox} from '@/components/ui/checkbox'
import {Group} from "@/types/marketing/group";
import {groupsApi} from "@/lib/api/marketing/groups";
import {marketingUsersApi} from "@/lib/api/marketing/users";
import {ImportUsersDialog} from '../users/import-users-dialog'

interface GroupDetailClientProps {
    group: Group;
}

export function GroupDetailClient({group}: GroupDetailClientProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const params = useParams()
    const groupId = parseInt(params.id as string)

    const [showRemoveDialog, setShowRemoveDialog] = useState(false)
    const [removingMember, setRemovingMember] = useState<{id: number; full_name: string} | null>(null)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
    const [memberSearch, setMemberSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showImportDialog, setShowImportDialog] = useState(false);

    const {data: membersData, isLoading: isLoadingMembers} = useQuery({
        queryKey: ['group-members', groupId, memberSearch, page],
        queryFn: () => groupsApi.getMembers(groupId, {
            search: memberSearch || undefined,
            page,
        }),
    });

    const {data: allUsersData, isLoading: isLoadingUsers} = useQuery({
        queryKey: ['marketing-users', 'all'],
        queryFn: () => marketingUsersApi.list({
            page_size: 1000,
        }),
    });

    const members = membersData?.results || []
    const totalMembers = membersData?.count || 0
    const totalPages = Math.ceil(totalMembers / 10)
    const allUsers = allUsersData?.results || []

    const memberIds = members.map(m => m.id)
    const availableUsers = allUsers.filter(u => !memberIds.includes(u.id))

    const handleSearch = (value: string) => {
        setMemberSearch(value)
        setPage(1)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const removeMemberMutation = useMutation({
        mutationFn: (userId: number) => groupsApi.removeMembers(groupId, [userId]),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['group-members', groupId]})
            await queryClient.invalidateQueries({queryKey: ['groups']})
            toast.success('Member removed successfully')
            setShowRemoveDialog(false)
            setRemovingMember(null)
        },
        onError: () => {
            toast.error('Failed to remove member')
        },
    })

    const addMembersMutation = useMutation({
        mutationFn: (userIds: number[]) => groupsApi.addMembers(groupId, userIds),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['group-members', groupId]})
            await queryClient.invalidateQueries({queryKey: ['groups']})
            toast.success(`Added ${selectedUserIds.length} members successfully`)
            setShowAddDialog(false)
            setSelectedUserIds([])
        },
        onError: () => {
            toast.error('Failed to add members')
        },
    })

    const handleRemoveClick = useCallback((member: {id: number; full_name: string}) => {
        setRemovingMember(member)
        setShowRemoveDialog(true)
    }, [])

    const handleRemove = useCallback(() => {
        if (!removingMember) return
        removeMemberMutation.mutate(removingMember.id)
    }, [removingMember, removeMemberMutation])

    const handleAddMembers = useCallback(() => {
        if (selectedUserIds.length === 0) {
            toast.error('Please select at least one user')
            return
        }
        addMembersMutation.mutate(selectedUserIds)
    }, [selectedUserIds, addMembersMutation])

    const toggleUser = (userId: number) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/marketing/groups'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div className='flex-1'>
                    <h1 className='text-3xl font-bold tracking-tight'>{group.name}</h1>
                    <p className='text-muted-foreground'>{group.description || 'No description'}</p>
                </div>
                <Link href={`/admin/marketing/groups/${groupId}/edit`}>
                    <Button>Edit Group</Button>
                </Link>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{group.member_count}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Owner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-lg font-medium'>{group.created_by_name}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={group.is_active ? 'default' : 'secondary'}>
                            {group.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>
                                {memberSearch ? `Found ${totalMembers} members` : `Showing ${members.length} of ${totalMembers} members`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search members...'
                                    className='pl-8 w-[250px]'
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch((e.target as HTMLInputElement).value)
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                variant='outline'
                                onClick={() => setShowImportDialog(true)}
                            >
                                <Upload className='mr-2 size-4'/>
                                Import
                            </Button>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <UserPlus className='mr-2 size-4'/>
                                Add Members
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingMembers ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 className='size-6 animate-spin text-muted-foreground'/>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                                            {memberSearch ? 'No members found matching your search' : 'No members in this group'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <span className='font-medium'>{member.full_name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{member.email || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-sm'>{member.phone || '-'}</span>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={member.is_active ? 'default' : 'secondary'}>
                                                {member.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleRemoveClick(member)}
                                            >
                                                <UserMinus className='size-4 mr-1'/>
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
                {!isLoadingMembers && totalPages > 1 && (
                    <div className='flex items-center justify-between px-6 py-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            Page {page} of {totalPages} ({totalMembers} total members)
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className='size-4 mr-1'/>
                                Previous
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                                <ChevronRight className='size-4 ml-1'/>
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {removingMember?.full_name} from this group?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRemovingMember(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemove}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Remove Member
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>Add Members to Group</DialogTitle>
                        <DialogDescription>
                            Select users to add to {group.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {isLoadingUsers ? (
                            <div className='flex items-center justify-center py-8'>
                                <Loader2 className='size-6 animate-spin text-muted-foreground'/>
                            </div>
                        ) : availableUsers.length === 0 ? (
                            <p className='text-sm text-muted-foreground text-center py-4'>
                                No available users to add
                            </p>
                        ) : (
                            availableUsers.map((user) => (
                                <div key={user.id} className='flex items-center space-x-2 p-2 hover:bg-muted rounded'>
                                    <Checkbox
                                        id={`add-user-${user.id}`}
                                        checked={selectedUserIds.includes(user.id)}
                                        onCheckedChange={() => toggleUser(user.id)}
                                    />
                                    <label
                                        htmlFor={`add-user-${user.id}`}
                                        className='flex-1 cursor-pointer'
                                    >
                                        <div>
                                            <p className='font-medium'>{user.full_name}</p>
                                            <p className='text-sm text-muted-foreground'>
                                                {user.email || user.phone}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setShowAddDialog(false)
                                setSelectedUserIds([])
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMembers}
                            disabled={selectedUserIds.length === 0 || addMembersMutation.isPending}
                        >
                            {addMembersMutation.isPending && (
                                <Loader2 className='mr-2 size-4 animate-spin'/>
                            )}
                            Add {selectedUserIds.length} Member{selectedUserIds.length !== 1 ? 's' : ''}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ImportUsersDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                groupId={groupId}
            />
        </div>
    )
}
