'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Separator} from '@/components/ui/separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ArrowLeft, Calendar, QrCode, Gift, TrendingUp, Eye, Pause, Play} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'

const Page = ({params}: { params: { id: string } }) => {
    // Mock data
    const campaign = {
        id: params.id,
        name: 'Summer Discount 2024',
        client: 'Pizza Palace',
        clientId: '1',
        country: 'United States',
        countryCode: 'US',
        type: 'Scratch Card',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'Active',
        description: 'Summer season special discount campaign for all customers',
        totalScans: 5420,
        totalRewards: 1234,
        rewardsPending: 234,
        rewardsRedeemed: 1000,
        totalQrCodes: 500,
        activeQrCodes: 450,
    }

    const recentScans = [
        {id: 1, customer: 'John Doe', branch: 'Main Street', reward: '$10 OFF', date: '2024-12-22 14:30', status: 'Redeemed'},
        {id: 2, customer: 'Jane Smith', branch: 'Downtown', reward: 'Free Pizza', date: '2024-12-22 14:15', status: 'Pending'},
        {id: 3, customer: 'Mike Johnson', branch: 'Main Street', reward: '$5 OFF', date: '2024-12-22 13:45', status: 'Redeemed'},
        {id: 4, customer: 'Sarah Wilson', branch: 'Westside', reward: 'No Prize', date: '2024-12-22 13:20', status: 'Completed'},
    ]

    const rewards = [
        {name: '$10 OFF', quantity: 100, issued: 45, redeemed: 32, pending: 13},
        {name: 'Free Pizza', quantity: 200, issued: 120, redeemed: 85, pending: 35},
        {name: '$5 OFF', quantity: 300, issued: 200, redeemed: 150, pending: 50},
        {name: 'Free Drink', quantity: 400, issued: 250, redeemed: 200, pending: 50},
    ]

    const handlePause = () => {
        toast.warning('Campaign paused successfully')
    }

    const handleResume = () => {
        toast.success('Campaign resumed successfully')
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href='/campaigns'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{campaign.name}</h1>
                        <p className='text-muted-foreground'>{campaign.client} • {campaign.country}</p>
                    </div>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                    </Badge>
                </div>
                <div className='flex items-center gap-2'>
                    {campaign.status === 'Active' ? (
                        <Button variant='outline' onClick={handlePause}>
                            <Pause className='mr-2 size-4'/>
                            Pause Campaign
                        </Button>
                    ) : (
                        <Button variant='outline' onClick={handleResume}>
                            <Play className='mr-2 size-4'/>
                            Resume Campaign
                        </Button>
                    )}
                    <Link href={`/campaigns/${params.id}/analytics`}>
                        <Button variant='outline'>
                            <TrendingUp className='mr-2 size-4'/>
                            View Analytics
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <Eye className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.totalScans.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Rewards Issued</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.totalRewards.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>{campaign.rewardsRedeemed} redeemed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending Rewards</CardTitle>
                        <Gift className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.rewardsPending.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Awaiting redemption</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>QR Codes</CardTitle>
                        <QrCode className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaign.totalQrCodes}</div>
                        <p className='text-xs text-muted-foreground'>{campaign.activeQrCodes} active</p>
                    </CardContent>
                </Card>
            </div>

            {/* Details Section */}
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Tabs defaultValue='scans' className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='scans'>Recent Scans</TabsTrigger>
                            <TabsTrigger value='rewards'>Rewards</TabsTrigger>
                        </TabsList>

                        <TabsContent value='scans'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Scans</CardTitle>
                                    <CardDescription>Latest customer interactions with the campaign</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Branch</TableHead>
                                                <TableHead>Reward</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead className='text-right'>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentScans.map((scan) => (
                                                <TableRow key={scan.id}>
                                                    <TableCell className='font-medium'>{scan.customer}</TableCell>
                                                    <TableCell>{scan.branch}</TableCell>
                                                    <TableCell>{scan.reward}</TableCell>
                                                    <TableCell className='text-sm text-muted-foreground'>{scan.date}</TableCell>
                                                    <TableCell className='text-right'>
                                                        <Badge
                                                            variant={
                                                                scan.status === 'Redeemed'
                                                                    ? 'default'
                                                                    : scan.status === 'Pending'
                                                                        ? 'secondary'
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
                                    <div className='mt-4 flex justify-center'>
                                        <Link href={`/campaigns/${params.id}/scans`}>
                                            <Button variant='outline' size='sm'>
                                                View All Scans
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='rewards'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Reward Distribution</CardTitle>
                                    <CardDescription>Breakdown of rewards in this campaign</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Reward</TableHead>
                                                <TableHead className='text-right'>Quantity</TableHead>
                                                <TableHead className='text-right'>Issued</TableHead>
                                                <TableHead className='text-right'>Redeemed</TableHead>
                                                <TableHead className='text-right'>Pending</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rewards.map((reward, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className='font-medium'>{reward.name}</TableCell>
                                                    <TableCell className='text-right'>{reward.quantity}</TableCell>
                                                    <TableCell className='text-right'>{reward.issued}</TableCell>
                                                    <TableCell className='text-right'>{reward.redeemed}</TableCell>
                                                    <TableCell className='text-right'>{reward.pending}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className='mt-4 flex justify-center'>
                                        <Link href={`/campaigns/${params.id}/rewards`}>
                                            <Button variant='outline' size='sm'>
                                                View All Rewards
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>

                <div className='lg:col-span-1 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign QR Code</CardTitle>
                            <CardDescription>Scan to access campaign</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex justify-center p-4 bg-muted rounded-lg'>
                                <div className='bg-white p-4 rounded-lg'>
                                    <QrCode className='size-32 text-foreground'/>
                                </div>
                            </div>
                            <Button className='w-full' variant='outline'>
                                <QrCode className='mr-2 size-4'/>
                                Download QR Code
                            </Button>
                            <div className='text-center'>
                                <p className='text-xs text-muted-foreground'>
                                    Campaign ID: {campaign.id}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Details</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <Calendar className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Campaign Type</p>
                                    <Badge variant='secondary' className='mt-1'>{campaign.type}</Badge>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Calendar className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Start Date</p>
                                    <p className='text-sm text-muted-foreground'>{campaign.startDate}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Calendar className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>End Date</p>
                                    <p className='text-sm text-muted-foreground'>{campaign.endDate}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Description</p>
                                <p className='text-sm text-muted-foreground mt-1'>{campaign.description}</p>
                            </div>
                            <Separator/>
                            <div className='space-y-2'>
                                <Link href={`/campaigns/${params.id}/edit`}>
                                    <Button className='w-full'>
                                        Edit Campaign
                                    </Button>
                                </Link>
                                <Link href={`/clients/${campaign.clientId}`}>
                                    <Button variant='outline' className='w-full'>
                                        View Client
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
