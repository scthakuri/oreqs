'use client'

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
import {ArrowLeft, Search, Download, Gift, TrendingUp} from 'lucide-react'
import Link from 'next/link'

const Page = ({params}: { params: { id: string } }) => {
    // Mock data
    const campaign = {
        id: params.id,
        name: 'Summer Discount 2024',
        client: 'Pizza Palace',
    }

    const rewardsData = [
        {
            id: 1,
            name: '$10 OFF',
            type: 'Discount',
            quantity: 100,
            issued: 45,
            redeemed: 32,
            pending: 13,
            expired: 0,
            redemptionRate: '71%',
        },
        {
            id: 2,
            name: 'Free Pizza',
            type: 'Product',
            quantity: 200,
            issued: 120,
            redeemed: 85,
            pending: 35,
            expired: 0,
            redemptionRate: '71%',
        },
        {
            id: 3,
            name: '$5 OFF',
            type: 'Discount',
            quantity: 300,
            issued: 200,
            redeemed: 150,
            pending: 50,
            expired: 0,
            redemptionRate: '75%',
        },
        {
            id: 4,
            name: 'Free Drink',
            type: 'Product',
            quantity: 400,
            issued: 250,
            redeemed: 200,
            pending: 50,
            expired: 0,
            redemptionRate: '80%',
        },
        {
            id: 5,
            name: 'Free Dessert',
            type: 'Product',
            quantity: 150,
            issued: 89,
            redeemed: 65,
            pending: 20,
            expired: 4,
            redemptionRate: '73%',
        },
    ]

    const recentRedemptions = [
        {
            id: 1,
            reward: '$10 OFF',
            customer: 'John Doe',
            phone: '+1 234 567 8901',
            branch: 'Main Street',
            issuedDate: '2024-12-22 14:30',
            redeemedDate: '2024-12-22 15:00',
            status: 'Redeemed',
        },
        {
            id: 2,
            reward: 'Free Pizza',
            customer: 'Jane Smith',
            phone: '+1 234 567 8902',
            branch: 'Downtown',
            issuedDate: '2024-12-22 14:15',
            redeemedDate: null,
            status: 'Pending',
        },
        {
            id: 3,
            reward: '$5 OFF',
            customer: 'Mike Johnson',
            phone: '+1 234 567 8903',
            branch: 'Main Street',
            issuedDate: '2024-12-22 13:45',
            redeemedDate: '2024-12-22 14:30',
            status: 'Redeemed',
        },
        {
            id: 4,
            reward: 'Free Drink',
            customer: 'Sarah Wilson',
            phone: '+1 234 567 8904',
            branch: 'Westside',
            issuedDate: '2024-12-21 16:20',
            redeemedDate: '2024-12-21 17:00',
            status: 'Redeemed',
        },
        {
            id: 5,
            reward: 'Free Dessert',
            customer: 'Emily Davis',
            phone: '+1 234 567 8905',
            branch: 'Downtown',
            issuedDate: '2024-12-20 12:50',
            redeemedDate: null,
            status: 'Expired',
        },
    ]

    const stats = {
        totalIssued: rewardsData.reduce((acc, r) => acc + r.issued, 0),
        totalRedeemed: rewardsData.reduce((acc, r) => acc + r.redeemed, 0),
        totalPending: rewardsData.reduce((acc, r) => acc + r.pending, 0),
        totalExpired: rewardsData.reduce((acc, r) => acc + r.expired, 0),
    }

    const redemptionRate = ((stats.totalRedeemed / stats.totalIssued) * 100).toFixed(1)

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
                        <h1 className='text-3xl font-bold tracking-tight'>Campaign Rewards</h1>
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
                        <CardTitle className='text-sm font-medium'>Total Issued</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.totalIssued}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Redeemed</CardTitle>
                        <Gift className='size-4 text-green-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-green-600'>{stats.totalRedeemed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending</CardTitle>
                        <Gift className='size-4 text-orange-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-orange-600'>{stats.totalPending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Expired</CardTitle>
                        <Gift className='size-4 text-red-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{stats.totalExpired}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Redemption Rate</CardTitle>
                        <TrendingUp className='size-4 text-blue-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-blue-600'>{redemptionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Rewards Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Reward Distribution</CardTitle>
                    <CardDescription>Overview of all rewards in this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reward Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className='text-right'>Quantity</TableHead>
                                <TableHead className='text-right'>Issued</TableHead>
                                <TableHead className='text-right'>Redeemed</TableHead>
                                <TableHead className='text-right'>Pending</TableHead>
                                <TableHead className='text-right'>Expired</TableHead>
                                <TableHead className='text-right'>Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rewardsData.map((reward) => (
                                <TableRow key={reward.id}>
                                    <TableCell className='font-medium'>{reward.name}</TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>{reward.type}</Badge>
                                    </TableCell>
                                    <TableCell className='text-right'>{reward.quantity}</TableCell>
                                    <TableCell className='text-right'>{reward.issued}</TableCell>
                                    <TableCell className='text-right text-green-600'>{reward.redeemed}</TableCell>
                                    <TableCell className='text-right text-orange-600'>{reward.pending}</TableCell>
                                    <TableCell className='text-right text-red-600'>{reward.expired}</TableCell>
                                    <TableCell className='text-right'>
                                        <Badge variant='secondary'>{reward.redemptionRate}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Redemptions */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Recent Reward Activity</CardTitle>
                            <CardDescription>Latest reward issuances and redemptions</CardDescription>
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
                                    <Input placeholder='Search rewards...' className='pl-8 w-[250px]'/>
                                </div>
                                <Select defaultValue='all'>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Reward Type'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Types</SelectItem>
                                        <SelectItem value='discount'>Discount</SelectItem>
                                        <SelectItem value='product'>Product</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Issued Date</TableHead>
                                        <TableHead>Redeemed Date</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRedemptions.map((redemption) => (
                                        <TableRow key={redemption.id}>
                                            <TableCell>
                                                <Badge variant='secondary'>{redemption.reward}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{redemption.customer}</span>
                                                    <span className='text-sm text-muted-foreground'>{redemption.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{redemption.branch}</TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>
                                                {redemption.issuedDate}
                                            </TableCell>
                                            <TableCell className='text-sm'>
                                                {redemption.redeemedDate ? (
                                                    <span className='text-green-600'>{redemption.redeemedDate}</span>
                                                ) : (
                                                    <span className='text-muted-foreground'>-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Badge
                                                    variant={
                                                        redemption.status === 'Redeemed'
                                                            ? 'default'
                                                            : redemption.status === 'Pending'
                                                                ? 'secondary'
                                                                : 'destructive'
                                                    }
                                                >
                                                    {redemption.status}
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
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Redeemed Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRedemptions
                                        .filter((r) => r.status === 'Redeemed')
                                        .map((redemption) => (
                                            <TableRow key={redemption.id}>
                                                <TableCell>
                                                    <Badge variant='secondary'>{redemption.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='font-medium'>{redemption.customer}</TableCell>
                                                <TableCell>{redemption.branch}</TableCell>
                                                <TableCell className='text-sm text-green-600'>
                                                    {redemption.redeemedDate}
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
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Issued Date</TableHead>
                                        <TableHead className='text-right'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRedemptions
                                        .filter((r) => r.status === 'Pending')
                                        .map((redemption) => (
                                            <TableRow key={redemption.id}>
                                                <TableCell>
                                                    <Badge variant='secondary'>{redemption.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='font-medium'>{redemption.customer}</TableCell>
                                                <TableCell>{redemption.branch}</TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {redemption.issuedDate}
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
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Issued Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRedemptions
                                        .filter((r) => r.status === 'Expired')
                                        .map((redemption) => (
                                            <TableRow key={redemption.id}>
                                                <TableCell>
                                                    <Badge variant='secondary'>{redemption.reward}</Badge>
                                                </TableCell>
                                                <TableCell className='font-medium'>{redemption.customer}</TableCell>
                                                <TableCell>{redemption.branch}</TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {redemption.issuedDate}
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
