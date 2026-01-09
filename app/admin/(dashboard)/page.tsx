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
import {
    Users,
    Building2,
    Megaphone,
    QrCode,
    TrendingUp,
    Gift,
    MessageSquare,
    Scan,
} from 'lucide-react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

// Static data for demonstration
const kpiData = [
    {
        title: 'Total Dealers',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: Users,
        description: 'Across all countries',
    },
    {
        title: 'Active Clients',
        value: '342',
        change: '+23%',
        trend: 'up',
        icon: Building2,
        description: 'Active subscriptions',
    },
    {
        title: 'Active Campaigns',
        value: '127',
        change: '+8%',
        trend: 'up',
        icon: Megaphone,
        description: 'Running campaigns',
    },
    {
        title: 'Total Scans',
        value: '45.2K',
        change: '+34%',
        trend: 'up',
        icon: Scan,
        description: 'This month',
    },
    {
        title: 'Rewards Issued',
        value: '12.8K',
        change: '+28%',
        trend: 'up',
        icon: Gift,
        description: 'This month',
    },
    {
        title: 'SMS Credits Used',
        value: '8.5K',
        change: '-5%',
        trend: 'down',
        icon: MessageSquare,
        description: 'This month',
    },
]

const scansData = [
    {month: 'Jan', scans: 4200, rewards: 1200},
    {month: 'Feb', scans: 5800, rewards: 1600},
    {month: 'Mar', scans: 7200, rewards: 2100},
    {month: 'Apr', scans: 8900, rewards: 2700},
    {month: 'May', scans: 12400, rewards: 3800},
    {month: 'Jun', scans: 15200, rewards: 4500},
]

const topCampaigns = [
    {name: 'Summer Discount 2024', client: 'Pizza Palace', scans: 5420, rewards: 1234, status: 'Active'},
    {name: 'Grand Opening Offer', client: 'Burger King', scans: 4280, rewards: 980, status: 'Active'},
    {name: 'Loyalty Rewards', client: 'Starbucks Nepal', scans: 3890, rewards: 1120, status: 'Active'},
    {name: 'Weekend Special', client: 'KFC Australia', scans: 3240, rewards: 890, status: 'Active'},
    {name: 'Happy Hour Campaign', client: 'Subway UK', scans: 2950, rewards: 750, status: 'Paused'},
]

const recentDealers = [
    {name: 'John Smith', country: 'United States', clients: 45, status: 'Active', joined: '2024-12-10'},
    {name: 'Emma Wilson', country: 'United Kingdom', clients: 32, status: 'Active', joined: '2024-12-08'},
    {name: 'Rajesh Kumar', country: 'Nepal', clients: 28, status: 'Active', joined: '2024-12-05'},
    {name: 'Sarah Johnson', country: 'Australia', clients: 19, status: 'Active', joined: '2024-12-01'},
]

const Page = () => {
    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Dashboard Overview</h1>
                <p className='text-muted-foreground'>Welcome back! Here's what's happening with OREQS.</p>
            </div>

            {/* KPI Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {kpiData.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{kpi.title}</CardTitle>
                            <kpi.icon className='size-4 text-muted-foreground'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{kpi.value}</div>
                            <p className='text-xs text-muted-foreground'>{kpi.description}</p>
                            <div className='mt-2 flex items-center gap-2'>
                                <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className='text-xs'>
                                    {kpi.change}
                                </Badge>
                                <span className='text-xs text-muted-foreground'>vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Scans & Rewards Trend</CardTitle>
                        <CardDescription>Monthly overview of scans and rewards issued</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={scansData}>
                                <CartesianGrid strokeDasharray='3 3'/>
                                <XAxis dataKey='month'/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type='monotone' dataKey='scans' stroke='hsl(var(--primary))' strokeWidth={2}/>
                                <Line type='monotone' dataKey='rewards' stroke='hsl(var(--chart-2))' strokeWidth={2}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Campaigns</CardTitle>
                        <CardDescription>Campaigns by total scans</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={topCampaigns.slice(0, 4)}>
                                <CartesianGrid strokeDasharray='3 3'/>
                                <XAxis dataKey='name' tick={{fontSize: 12}} angle={-45} textAnchor='end' height={100}/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey='scans' fill='hsl(var(--primary))'/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Tables */}
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Campaigns</CardTitle>
                        <CardDescription>Most active campaigns this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead className='text-right'>Scans</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topCampaigns.map((campaign) => (
                                    <TableRow key={campaign.name}>
                                        <TableCell className='font-medium'>{campaign.name}</TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>{campaign.client}</TableCell>
                                        <TableCell className='text-right'>{campaign.scans.toLocaleString()}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Dealers</CardTitle>
                        <CardDescription>Newly added dealers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead className='text-right'>Clients</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDealers.map((dealer) => (
                                    <TableRow key={dealer.name}>
                                        <TableCell className='font-medium'>{dealer.name}</TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>{dealer.country}</TableCell>
                                        <TableCell className='text-right'>{dealer.clients}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant='default'>{dealer.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page