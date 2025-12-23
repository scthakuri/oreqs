'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {ArrowLeft, Search, Download, Filter, Eye} from 'lucide-react'
import Link from 'next/link'

const Page = ({params}: { params: { id: string } }) => {
    // Mock data
    const campaign = {
        id: params.id,
        name: 'Summer Discount 2024',
        client: 'Pizza Palace',
    }

    const scansData = [
        {
            id: 1,
            customer: 'John Doe',
            phone: '+1 234 567 8901',
            branch: 'Main Street',
            branchId: '1',
            reward: '$10 OFF',
            scanDate: '2024-12-22',
            scanTime: '14:30:25',
            status: 'Redeemed',
            redeemedDate: '2024-12-22',
            redeemedTime: '15:00:00',
            qrCode: 'QR-001',
        },
        {
            id: 2,
            customer: 'Jane Smith',
            phone: '+1 234 567 8902',
            branch: 'Downtown',
            branchId: '2',
            reward: 'Free Pizza',
            scanDate: '2024-12-22',
            scanTime: '14:15:10',
            status: 'Pending',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-002',
        },
        {
            id: 3,
            customer: 'Mike Johnson',
            phone: '+1 234 567 8903',
            branch: 'Main Street',
            branchId: '1',
            reward: '$5 OFF',
            scanDate: '2024-12-22',
            scanTime: '13:45:30',
            status: 'Redeemed',
            redeemedDate: '2024-12-22',
            redeemedTime: '14:30:00',
            qrCode: 'QR-001',
        },
        {
            id: 4,
            customer: 'Sarah Wilson',
            phone: '+1 234 567 8904',
            branch: 'Westside',
            branchId: '3',
            reward: 'No Prize',
            scanDate: '2024-12-22',
            scanTime: '13:20:15',
            status: 'Completed',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-003',
        },
        {
            id: 5,
            customer: 'Emily Davis',
            phone: '+1 234 567 8905',
            branch: 'Downtown',
            branchId: '2',
            reward: 'Free Drink',
            scanDate: '2024-12-22',
            scanTime: '12:50:40',
            status: 'Pending',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-002',
        },
        {
            id: 6,
            customer: 'Robert Brown',
            phone: '+1 234 567 8906',
            branch: 'Main Street',
            branchId: '1',
            reward: '$10 OFF',
            scanDate: '2024-12-22',
            scanTime: '12:30:20',
            status: 'Expired',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-001',
        },
        {
            id: 7,
            customer: 'Lisa Anderson',
            phone: '+1 234 567 8907',
            branch: 'Eastside',
            branchId: '4',
            reward: 'Free Pizza',
            scanDate: '2024-12-21',
            scanTime: '18:45:10',
            status: 'Redeemed',
            redeemedDate: '2024-12-21',
            redeemedTime: '19:15:00',
            qrCode: 'QR-004',
        },
        {
            id: 8,
            customer: 'David Martinez',
            phone: '+1 234 567 8908',
            branch: 'Main Street',
            branchId: '1',
            reward: 'No Prize',
            scanDate: '2024-12-21',
            scanTime: '17:20:35',
            status: 'Completed',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-001',
        },
        {
            id: 9,
            customer: 'Jennifer Taylor',
            phone: '+1 234 567 8909',
            branch: 'Downtown',
            branchId: '2',
            reward: '$5 OFF',
            scanDate: '2024-12-21',
            scanTime: '16:10:50',
            status: 'Pending',
            redeemedDate: null,
            redeemedTime: null,
            qrCode: 'QR-002',
        },
        {
            id: 10,
            customer: 'Christopher Lee',
            phone: '+1 234 567 8910',
            branch: 'Westside',
            branchId: '3',
            reward: 'Free Drink',
            scanDate: '2024-12-21',
            scanTime: '15:30:25',
            status: 'Redeemed',
            redeemedDate: '2024-12-21',
            redeemedTime: '16:00:00',
            qrCode: 'QR-003',
        },
    ]

    const stats = {
        total: scansData.length,
        redeemed: scansData.filter(s => s.status === 'Redeemed').length,
        pending: scansData.filter(s => s.status === 'Pending').length,
        expired: scansData.filter(s => s.status === 'Expired').length,
        completed: scansData.filter(s => s.status === 'Completed').length,
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href={`/campaigns/${params.id}`}>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Campaign Scans</h1>
                        <p className='text-muted-foreground'>{campaign.name} • {campaign.client}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Download className='mr-2 size-4'/>
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-5'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Redeemed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-green-600'>{stats.redeemed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-orange-600'>{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Expired</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{stats.expired}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>No Prize</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-muted-foreground'>{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Scans Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Scans</CardTitle>
                            <CardDescription>Complete history of campaign scans</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue='all' className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='redeemed'>Redeemed</TabsTrigger>
                                <TabsTrigger value='pending'>Pending</TabsTrigger>
                                <TabsTrigger value='expired'>Expired</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input placeholder='Search scans...' className='pl-8 w-[250px]'/>
                                </div>
                                <Select defaultValue='all'>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Branch'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Branches</SelectItem>
                                        <SelectItem value='1'>Main Street</SelectItem>
                                        <SelectItem value='2'>Downtown</SelectItem>
                                        <SelectItem value='3'>Westside</SelectItem>
                                        <SelectItem value='4'>Eastside</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select defaultValue='today'>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Date'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='today'>Today</SelectItem>
                                        <SelectItem value='yesterday'>Yesterday</SelectItem>
                                        <SelectItem value='week'>Last 7 days</SelectItem>
                                        <SelectItem value='month'>Last 30 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Scan Date & Time</TableHead>
                                        <TableHead>Redeemed Date & Time</TableHead>
                                        <TableHead>QR Code</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scansData.map((scan) => (
                                        <TableRow key={scan.id}>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{scan.customer}</span>
                                                    <span className='text-sm text-muted-foreground'>{scan.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/branches/${scan.branchId}`}>
                                                    <span className='text-sm hover:underline'>{scan.branch}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>{scan.reward}</Badge>
                                            </TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>
                                                {scan.scanDate} {scan.scanTime}
                                            </TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>
                                                {scan.redeemedDate ? `${scan.redeemedDate} ${scan.redeemedTime}` : '-'}
                                            </TableCell>
                                            <TableCell className='text-sm'>{scan.qrCode}</TableCell>
                                            <TableCell className='text-right'>
                                                <Badge
                                                    variant={
                                                        scan.status === 'Redeemed'
                                                            ? 'default'
                                                            : scan.status === 'Pending'
                                                                ? 'secondary'
                                                                : scan.status === 'Expired'
                                                                    ? 'destructive'
                                                                    : 'outline'
                                                    }
                                                >
                                                    {scan.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='redeemed'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Scan Date & Time</TableHead>
                                        <TableHead>Redeemed Date & Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scansData
                                        .filter((s) => s.status === 'Redeemed')
                                        .map((scan) => (
                                            <TableRow key={scan.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{scan.customer}</span>
                                                        <span className='text-sm text-muted-foreground'>{scan.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{scan.branch}</TableCell>
                                                <TableCell>
                                                    <Badge variant='secondary'>{scan.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {scan.scanDate} {scan.scanTime}
                                                </TableCell>
                                                <TableCell className='text-sm text-green-600'>
                                                    {scan.redeemedDate} {scan.redeemedTime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='pending'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Scan Date & Time</TableHead>
                                        <TableHead className='text-right'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scansData
                                        .filter((s) => s.status === 'Pending')
                                        .map((scan) => (
                                            <TableRow key={scan.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{scan.customer}</span>
                                                        <span className='text-sm text-muted-foreground'>{scan.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{scan.branch}</TableCell>
                                                <TableCell>
                                                    <Badge variant='secondary'>{scan.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {scan.scanDate} {scan.scanTime}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Button variant='outline' size='sm'>
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='expired'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Scan Date & Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scansData
                                        .filter((s) => s.status === 'Expired')
                                        .map((scan) => (
                                            <TableRow key={scan.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{scan.customer}</span>
                                                        <span className='text-sm text-muted-foreground'>{scan.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{scan.branch}</TableCell>
                                                <TableCell>
                                                    <Badge variant='secondary'>{scan.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {scan.scanDate} {scan.scanTime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
