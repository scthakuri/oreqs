'use client'

import {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import {Loader2, Eye} from 'lucide-react'
import Link from 'next/link'
import {clientsApi} from '@/lib/api/clients'

interface DealerClientsTabProps {
    dealerId: number
}

export function DealerClientsTab({dealerId}: DealerClientsTabProps) {
    const [clientsPage, setClientsPage] = useState(1)

    const {data: clientsData, isLoading: isClientsLoading} = useQuery({
        queryKey: ['clients', 'dealer', dealerId, clientsPage],
        queryFn: () => clientsApi.list({dealer: dealerId, page: clientsPage, ordering: '-created_at'}),
    })

    const clients = clientsData?.results || []
    const clientsTotalPages = clientsData?.total_pages || 1

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>All clients under this dealer</CardDescription>
            </CardHeader>
            <CardContent>
                {isClientsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                        <Loader2 className='size-6 animate-spin text-muted-foreground'/>
                    </div>
                ) : clients.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                        No clients found
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className='text-right'>Branches</TableHead>
                                    <TableHead className='text-right'>Campaigns</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id} className='cursor-pointer hover:bg-muted/50'>
                                        <TableCell className='font-medium'>
                                            {client.user.full_name}
                                        </TableCell>
                                        <TableCell className='text-muted-foreground'>
                                            {client.user.email}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            {client.branches_count}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            {client.campaigns_count}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={client.is_active ? 'default' : 'secondary'}>
                                                {client.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Link href={`/clients/${client.id}`}>
                                                <Button variant='ghost' size='sm'>
                                                    <Eye className='size-4'/>
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {clientsTotalPages > 1 && (
                            <div className='mt-4'>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setClientsPage(p => Math.max(1, p - 1))}
                                                className={clientsPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                        {Array.from({length: Math.min(5, clientsTotalPages)}, (_, i) => {
                                            const page = i + 1
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={() => setClientsPage(page)}
                                                        isActive={clientsPage === page}
                                                        className='cursor-pointer'
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        })}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setClientsPage(p => Math.min(clientsTotalPages, p + 1))}
                                                className={clientsPage === clientsTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
    )
}
