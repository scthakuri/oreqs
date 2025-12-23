'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    ArrowLeft,
    Building2,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Store,
    Megaphone,
    TrendingUp,
    Users,
    Settings,
    CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
import {toast} from 'sonner'

// Mock data - would come from API
const clientData = {
    id: 1,
    name: 'Pizza Palace',
    email: 'contact@pizzapalace.com',
    phone: '+1 234 567 8900',
    dealer: 'John Smith',
    dealerEmail: 'john@dealer.com',
    country: 'United States',
    countryCode: 'US',
    address: '123 Main Street, New York, NY 10001',
    branches: 12,
    activeBranches: 10,
    campaigns: 8,
    activeCampaigns: 5,
    status: 'Active',
    subscription: 'Premium',
    subscriptionPrice: '$199/month',
    joined: '2024-01-20',
    lastActive: '2 hours ago',
    totalScans: 45230,
    totalRewards: 12450,
    revenue: '$125,400',
    smsCredits: 5420,
}

const recentBranches = [
    {id: 1, name: 'Downtown Branch', location: 'New York, NY', status: 'Active', campaigns: 3},
    {id: 2, name: 'Times Square', location: 'New York, NY', status: 'Active', campaigns: 2},
    {id: 3, name: 'Brooklyn Branch', location: 'Brooklyn, NY', status: 'Active', campaigns: 1},
    {id: 4, name: 'Queens Branch', location: 'Queens, NY', status: 'Inactive', campaigns: 0},
]

const recentCampaigns = [
    {
        id: 1,
        name: 'Summer Special 2024',
        type: 'Spin Wheel',
        status: 'Active',
        scans: 12340,
        rewards: 3210,
        endDate: '2024-08-30'
    },
    {
        id: 2,
        name: 'Weekend Bonus',
        type: 'Scratch Card',
        status: 'Active',
        scans: 8920,
        rewards: 2150,
        endDate: '2024-07-15'
    },
    {
        id: 3,
        name: 'New Customer Welcome',
        type: 'Slot Machine',
        status: 'Completed',
        scans: 15630,
        rewards: 4820,
        endDate: '2024-06-30'
    },
]

const activityLog = [
    {id: 1, action: 'Campaign "Summer Special 2024" started', time: '2 hours ago', type: 'campaign'},
    {id: 2, action: 'New branch "Brooklyn Branch" added', time: '1 day ago', type: 'branch'},
    {id: 3, action: 'Subscription renewed - Premium Plan', time: '3 days ago', type: 'billing'},
    {id: 4, action: 'Campaign "Weekend Bonus" edited', time: '5 days ago', type: 'campaign'},
    {id: 5, action: 'SMS credits purchased - 5000 credits', time: '1 week ago', type: 'billing'},
]

const Page = () => {
    const params = useParams()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('overview')

    const handleAction = (action: string) => {
        switch (action) {
            case 'edit':
                router.push(`/clients/${params.id}/edit`)
                break
            case 'suspend':
                toast.error(`${clientData.name} has been suspended`)
                break
            case 'upgrade':
                toast.success('Opening upgrade plan dialog...')
                break
            case 'delete':
                toast.error('Client deletion requires confirmation')
                break
            default:
                toast.info(`Action: ${action}`)
        }
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href='/clients'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-3xl font-bold tracking-tight'>{clientData.name}</h1>
                            <Badge variant={clientData.status === 'Active' ? 'default' : 'destructive'}>
                                {clientData.status}
                            </Badge>
                            <Badge variant='outline'>{clientData.subscription}</Badge>
                        </div>
                        <p className='text-muted-foreground'>Client ID: #{clientData.id} • Joined {clientData.joined}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => handleAction('edit')}>
                        <Settings className='mr-2 size-4'/>
                        Edit Client
                    </Button>
                    <Link href={`/clients/${params.id}/branches`}>
                        <Button variant='outline'>
                            <Store className='mr-2 size-4'/>
                            Manage Branches
                        </Button>
                    </Link>
                    <Link href={`/clients/${params.id}/campaigns`}>
                        <Button>
                            <Megaphone className='mr-2 size-4'/>
                            View Campaigns
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <TrendingUp className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{clientData.totalScans.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Rewards</CardTitle>
                        <Users className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{clientData.totalRewards.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Across all campaigns</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Active Branches</CardTitle>
                        <Store className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{clientData.activeBranches}/{clientData.branches}</div>
                        <p className='text-xs text-muted-foreground'>Branches operational</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>SMS Credits</CardTitle>
                        <CreditCard className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{clientData.smsCredits.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Credits remaining</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='branches'>Branches</TabsTrigger>
                    <TabsTrigger value='campaigns'>Campaigns</TabsTrigger>
                    <TabsTrigger value='activity'>Activity Log</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value='overview' className='space-y-6'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Information</CardTitle>
                                <CardDescription>Basic details and contact information</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                    <Building2 className='size-5 text-muted-foreground mt-0.5'/>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>Business Name</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.name}</p>
                                    </div>
                                </div>
                                <Separator/>
                                <div className='flex items-start gap-3'>
                                    <Mail className='size-5 text-muted-foreground mt-0.5'/>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>Email</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.email}</p>
                                    </div>
                                </div>
                                <Separator/>
                                <div className='flex items-start gap-3'>
                                    <Phone className='size-5 text-muted-foreground mt-0.5'/>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>Phone</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.phone}</p>
                                    </div>
                                </div>
                                <Separator/>
                                <div className='flex items-start gap-3'>
                                    <MapPin className='size-5 text-muted-foreground mt-0.5'/>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>Address</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.address}</p>
                                    </div>
                                </div>
                                <Separator/>
                                <div className='flex items-start gap-3'>
                                    <Calendar className='size-5 text-muted-foreground mt-0.5'/>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>Last Active</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.lastActive}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Details</CardTitle>
                                <CardDescription>Plan and billing information</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium'>Current Plan</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.subscription}</p>
                                    </div>
                                    <Badge variant='default'>{clientData.subscriptionPrice}</Badge>
                                </div>
                                <Separator/>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium'>Dealer</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.dealer}</p>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>{clientData.dealerEmail}</p>
                                </div>
                                <Separator/>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium'>Country</p>
                                        <p className='text-sm text-muted-foreground'>{clientData.country}</p>
                                    </div>
                                    <Badge variant='outline'>{clientData.countryCode}</Badge>
                                </div>
                                <Separator/>
                                <div className='space-y-2'>
                                    <p className='text-sm font-medium'>Quick Actions</p>
                                    <div className='flex gap-2'>
                                        <Button variant='outline' size='sm' onClick={() => handleAction('upgrade')}>
                                            Upgrade Plan
                                        </Button>
                                        <Button variant='outline' size='sm' onClick={() => toast.info('Opening billing details')}>
                                            View Billing
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Branches Tab */}
                <TabsContent value='branches' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Branches</CardTitle>
                                    <CardDescription>Manage client locations and branches</CardDescription>
                                </div>
                                <Link href={`/clients/${params.id}/branches`}>
                                    <Button>View All Branches</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Branch Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='text-right'>Active Campaigns</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentBranches.map((branch) => (
                                        <TableRow key={branch.id}>
                                            <TableCell className='font-medium'>{branch.name}</TableCell>
                                            <TableCell>{branch.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={branch.status === 'Active' ? 'default' : 'secondary'}>
                                                    {branch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>{branch.campaigns}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value='campaigns' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Campaigns</CardTitle>
                                    <CardDescription>Recent campaign activity</CardDescription>
                                </div>
                                <Link href={`/clients/${params.id}/campaigns`}>
                                    <Button>View All Campaigns</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='text-right'>Scans</TableHead>
                                        <TableHead className='text-right'>Rewards</TableHead>
                                        <TableHead className='text-right'>End Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell className='font-medium'>{campaign.name}</TableCell>
                                            <TableCell>
                                                <Badge variant='outline'>{campaign.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                                    {campaign.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>{campaign.scans.toLocaleString()}</TableCell>
                                            <TableCell className='text-right'>{campaign.rewards.toLocaleString()}</TableCell>
                                            <TableCell className='text-right text-sm text-muted-foreground'>
                                                {campaign.endDate}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Log Tab */}
                <TabsContent value='activity' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                            <CardDescription>Recent activities and changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {activityLog.map((activity) => (
                                    <div key={activity.id} className='flex items-start gap-4'>
                                        <div className='flex size-8 items-center justify-center rounded-full bg-muted'>
                                            {activity.type === 'campaign' && <Megaphone className='size-4'/>}
                                            {activity.type === 'branch' && <Store className='size-4'/>}
                                            {activity.type === 'billing' && <CreditCard className='size-4'/>}
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                            <p className='text-sm font-medium'>{activity.action}</p>
                                            <p className='text-xs text-muted-foreground'>{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page
