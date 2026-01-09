'use client'

import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import {Loader2, Plus, MoreHorizontal, Edit, Trash2, MapPin} from 'lucide-react'
import {branchesApi} from '@/lib/api/branches'
import {BranchForm} from '@/components/forms/branch-form'
import {BranchEditForm} from '@/components/forms/branch-edit-form'
import {format} from 'date-fns'
import {toast} from 'sonner'
import type {Branch} from '@/types/api'

interface ClientBranchesTabProps {
    clientId: number
}

export function ClientBranchesTab({clientId}: ClientBranchesTabProps) {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)

    const {data: branchesData, isLoading: isBranchesLoading} = useQuery({
        queryKey: ['branches', 'client', clientId, page],
        queryFn: () => branchesApi.list({client: clientId, page, ordering: '-created_at'}),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await branchesApi.delete(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['branches']})
            queryClient.invalidateQueries({queryKey: ['client', clientId]})
            toast.success('Branch deleted successfully')
            setBranchToDelete(null)
        },
        onError: () => {
            toast.error('Failed to delete branch')
        },
    })

    const branches = branchesData?.results || []
    const totalPages = branchesData?.total_pages || 1

    const handleEdit = (branch: Branch) => {
        setSelectedBranch(branch)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (branch: Branch) => {
        setBranchToDelete(branch)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Branches</CardTitle>
                            <CardDescription>All branches under this client</CardDescription>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className='mr-2 size-4'/>
                                    Add Branch
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-4xl h-[60vh] flex flex-col p-0'>
                                <DialogHeader className='px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10'>
                                    <DialogTitle>Add New Branch</DialogTitle>
                                    <DialogDescription>
                                        Create a new branch and branch manager account
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='flex-1 overflow-y-auto px-6 pt-4'>
                                    <BranchForm
                                        clientId={clientId}
                                        onSuccess={() => setIsCreateDialogOpen(false)}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {isBranchesLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 className='size-6 animate-spin text-muted-foreground'/>
                        </div>
                    ) : branches.length === 0 ? (
                        <div className='text-center py-12 text-muted-foreground'>
                            <MapPin className='size-12 mx-auto mb-4 opacity-50'/>
                            <p className='text-lg font-medium'>No branches yet</p>
                            <p className='text-sm'>Click "Add Branch" to create your first branch</p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Branch Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Manager</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className='text-right'>Campaigns</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {branches.map((branch) => (
                                        <TableRow key={branch.id}>
                                            <TableCell className='font-medium'>{branch.branch_name}</TableCell>
                                            <TableCell>
                                                <Badge variant='outline' className='font-mono text-xs'>
                                                    {branch.branch_code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{branch.user.full_name}</TableCell>
                                            <TableCell className='text-muted-foreground'>{branch.user.email}</TableCell>
                                            <TableCell className='text-muted-foreground'>
                                                {branch.city || 'N/A'}
                                            </TableCell>
                                            <TableCell className='text-right'>{branch.campaigns_count}</TableCell>
                                            <TableCell className='text-right'>
                                                <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                                                    {branch.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='sm'>
                                                            <MoreHorizontal className='size-4'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuItem onClick={() => handleEdit(branch)}>
                                                            <Edit className='mr-2 size-4'/>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(branch)}
                                                            className='text-destructive'
                                                        >
                                                            <Trash2 className='mr-2 size-4'/>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {totalPages > 1 && (
                                <div className='mt-4'>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                                const pageNum = i + 1
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            onClick={() => setPage(pageNum)}
                                                            isActive={page === pageNum}
                                                            className='cursor-pointer'
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )
                                            })}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='max-w-4xl h-[60vh] flex flex-col p-0'>
                    <DialogHeader className='px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10'>
                        <DialogTitle>Edit Branch</DialogTitle>
                        <DialogDescription>
                            Update branch information
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex-1 overflow-y-auto px-6 pt-4'>
                        {selectedBranch && (
                            <BranchEditForm
                                branch={selectedBranch}
                                onSuccess={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Branch</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{branchToDelete?.branch_name}</strong>?
                            This action cannot be undone. The branch manager account will also be deactivated.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => branchToDelete && deleteMutation.mutate(branchToDelete.id)}
                            className='bg-destructive hover:bg-destructive/90'
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className='mr-2 size-4 animate-spin'/>
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
