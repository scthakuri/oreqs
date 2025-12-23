'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Search, MoreHorizontal, Megaphone, Scan, Gift, Eye, Plus} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

// Static data for campaigns
const campaignsData = [
    {
        id: 1,
        name: 'Summer Discount 2024',
        client: 'Pizza Palace',
        country: 'United States',
        countryCode: 'US',
        type: 'Scratch Card',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'Active',
        totalScans: 5420,
        totalRewards: 1234,
        rewardsPending: 234,
        rewardsRedeemed: 1000,
    },
    {
        id: 2,
        name: 'Grand Opening Offer',
        client: 'Burger King',
        country: 'United States',
        countryCode: 'US',
        type: 'Spin Wheel',
        startDate: '2024-05-15',
        endDate: '2024-12-31',
        status: 'Active',
        totalScans: 4280,
        totalRewards: 980,
        rewardsPending: 180,
        rewardsRedeemed: 800,
    },
    {
        id: 3,
        name: 'Loyalty Rewards',
        client: 'Starbucks Nepal',
        country: 'Nepal',
        countryCode: 'NP',
        type: 'Scratch Card',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Active',
        totalScans: 3890,
        totalRewards: 1120,
        rewardsPending: 320,
        rewardsRedeemed: 800,
    },
    {
        id: 4,
        name: 'Weekend Special',
        client: 'KFC Australia',
        country: 'Australia',
        countryCode: 'AU',
        type: 'Slot Machine',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        status: 'Active',
        totalScans: 3240,
        totalRewards: 890,
        rewardsPending: 190,
        rewardsRedeemed: 700,
    },
    {
        id: 5,
        name: 'Happy Hour Campaign',
        client: 'Subway UK',
        country: 'United Kingdom',
        countryCode: 'UK',
        type: 'Spin Wheel',
        startDate: '2024-05-01',
        endDate: '2024-07-31',
        status: 'Paused',
        totalScans: 2950,
        totalRewards: 750,
        rewardsPending: 150,
        rewardsRedeemed: 600,
    },
    {
        id: 6,
        name: 'New Year Bonanza',
        client: 'Pizza Palace',
        country: 'United States',
        countryCode: 'US',
        type: 'Scratch Card',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'Completed',
        totalScans: 8500,
        totalRewards: 2400,
        rewardsPending: 0,
        rewardsRedeemed: 2400,
    },
    {
        id: 7,
        name: 'Trial Campaign',
        client: 'Local Diner',
        country: 'United States',
        countryCode: 'US',
        type: 'Scratch Card',
        startDate: '2024-12-15',
        endDate: '2024-12-25',
        status: 'Draft',
        totalScans: 0,
        totalRewards: 0,
        rewardsPending: 0,
        rewardsRedeemed: 0,
    },
]

const stats = [
    {
        title: 'Total Campaigns',
        value: '127',
        icon: Megaphone,
        description: 'All time',
    },
    {
        title: 'Total Scans',
        value: '45.2K',
        icon: Scan,
        description: 'This month',
    },
    {
        title: 'Rewards Issued',
        value: '12.8K',
        icon: Gift,
        description: 'This month',
    },
]

const Page = () => {
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Campaigns Overview</h1>
                    <p className='text-muted-foreground'>Monitor all campaigns across clients and countries</p>
                </div>
                <Link href='/campaigns/new'>
                    <Button size='lg'>
                        <Plus className='mr-2 size-4'/>
                        Create Campaign
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-3'>
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className='size-4 text-muted-foreground'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground'>{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Campaigns</CardTitle>
                            <CardDescription>View and monitor campaign performance</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue='all' className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='active'>Active</TabsTrigger>
                                <TabsTrigger value='paused'>Paused</TabsTrigger>
                                <TabsTrigger value='completed'>Completed</TabsTrigger>
                                <TabsTrigger value='draft'>Draft</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input placeholder='Search campaigns...' className='pl-8 w-[250px]'/>
                                </div>
                                <Select defaultValue='all'>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Country'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Countries</SelectItem>
                                        <SelectItem value='US'>United States</SelectItem>
                                        <SelectItem value='UK'>United Kingdom</SelectItem>
                                        <SelectItem value='AU'>Australia</SelectItem>
                                        <SelectItem value='NP'>Nepal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select defaultValue='all'>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Type'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Types</SelectItem>
                                        <SelectItem value='scratch'>Scratch Card</SelectItem>
                                        <SelectItem value='wheel'>Spin Wheel</SelectItem>
                                        <SelectItem value='slot'>Slot Machine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className='text-right'>Scans</TableHead>
                                        <TableHead className='text-right'>Rewards</TableHead>
                                        <TableHead className='text-right'>Pending</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{campaign.name}</span>
                                                    <span className='text-sm text-muted-foreground'>
                                                        {campaign.startDate} - {campaign.endDate}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='text-sm'>{campaign.client}</span>
                                                    <Badge variant='outline' className='w-fit'>
                                                        {campaign.countryCode}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>{campaign.type}</Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>{campaign.totalScans.toLocaleString()}</TableCell>
                                            <TableCell className='text-right'>{campaign.totalRewards.toLocaleString()}</TableCell>
                                            <TableCell className='text-right'>
                                                {campaign.rewardsPending > 0 ? (
                                                    <span className='font-medium text-orange-600'>
                                                        {campaign.rewardsPending.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className='text-muted-foreground'>0</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Badge
                                                    variant={
                                                        campaign.status === 'Active'
                                                            ? 'default'
                                                            : campaign.status === 'Completed'
                                                                ? 'secondary'
                                                                : campaign.status === 'Paused'
                                                                    ? 'destructive'
                                                                    : 'outline'
                                                    }
                                                >
                                                    {campaign.status}
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
                                                            <Link href={`/campaigns/${campaign.id}`}>
                                                                <Eye className='mr-2 size-4'/>
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/campaigns/${campaign.id}/analytics`}>
                                                                View Analytics
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/campaigns/${campaign.id}/rewards`}>
                                                                View Rewards
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='active'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className='text-right'>Scans</TableHead>
                                        <TableHead className='text-right'>Rewards</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData
                                        .filter((c) => c.status === 'Active')
                                        .map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{campaign.name}</span>
                                                        <span className='text-sm text-muted-foreground'>
                                                            {campaign.startDate} - {campaign.endDate}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{campaign.client}</TableCell>
                                                <TableCell>
                                                    <Badge variant='secondary'>{campaign.type}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.totalScans.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.totalRewards.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Link href={`/campaigns/${campaign.id}`}>
                                                        <Button variant='outline' size='sm'>
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='paused'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead className='text-right'>Scans</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData
                                        .filter((c) => c.status === 'Paused')
                                        .map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell className='font-medium'>{campaign.name}</TableCell>
                                                <TableCell className='text-sm'>{campaign.client}</TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.totalScans.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Button variant='outline' size='sm'>
                                                        Resume
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='completed'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead className='text-right'>Total Scans</TableHead>
                                        <TableHead className='text-right'>Total Rewards</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData
                                        .filter((c) => c.status === 'Completed')
                                        .map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell className='font-medium'>{campaign.name}</TableCell>
                                                <TableCell className='text-sm'>{campaign.client}</TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {campaign.startDate} - {campaign.endDate}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.totalScans.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.totalRewards.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Link href={`/campaigns/${campaign.id}/report`}>
                                                        <Button variant='outline' size='sm'>
                                                            View Report
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='draft'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData
                                        .filter((c) => c.status === 'Draft')
                                        .map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell className='font-medium'>{campaign.name}</TableCell>
                                                <TableCell className='text-sm'>{campaign.client}</TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {campaign.startDate}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <div className='flex justify-end gap-2'>
                                                        <Link href={`/campaigns/${campaign.id}/edit`}>
                                                            <Button variant='outline' size='sm'>
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button size='sm'>Publish</Button>
                                                    </div>
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
