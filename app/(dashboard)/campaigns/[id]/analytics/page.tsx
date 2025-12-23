'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ArrowLeft, TrendingUp, TrendingDown, Download} from 'lucide-react'
import Link from 'next/link'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const Page = ({params}: { params: { id: string } }) => {
    // Mock data
    const campaign = {
        id: params.id,
        name: 'Summer Discount 2024',
        client: 'Pizza Palace',
        status: 'Active',
    }

    const dailyScansData = [
        {date: 'Dec 15', scans: 420, rewards: 145},
        {date: 'Dec 16', scans: 380, rewards: 132},
        {date: 'Dec 17', scans: 510, rewards: 178},
        {date: 'Dec 18', scans: 470, rewards: 164},
        {date: 'Dec 19', scans: 550, rewards: 192},
        {date: 'Dec 20', scans: 490, rewards: 171},
        {date: 'Dec 21', scans: 520, rewards: 182},
        {date: 'Dec 22', scans: 580, rewards: 203},
    ]

    const branchPerformance = [
        {branch: 'Main Street', scans: 1250, rewards: 437},
        {branch: 'Downtown', scans: 980, rewards: 343},
        {branch: 'Westside', scans: 820, rewards: 287},
        {branch: 'Eastside', scans: 650, rewards: 228},
    ]

    const rewardDistribution = [
        {name: '$10 OFF', value: 45, color: '#0088FE'},
        {name: 'Free Pizza', value: 120, color: '#00C49F'},
        {name: '$5 OFF', value: 200, color: '#FFBB28'},
        {name: 'Free Drink', value: 250, color: '#FF8042'},
        {name: 'No Prize', value: 385, color: '#8884D8'},
    ]

    const hourlyDistribution = [
        {hour: '9 AM', scans: 45},
        {hour: '10 AM', scans: 78},
        {hour: '11 AM', scans: 125},
        {hour: '12 PM', scans: 198},
        {hour: '1 PM', scans: 245},
        {hour: '2 PM', scans: 210},
        {hour: '3 PM', scans: 185},
        {hour: '4 PM', scans: 165},
        {hour: '5 PM', scans: 220},
        {hour: '6 PM', scans: 280},
        {hour: '7 PM', scans: 310},
        {hour: '8 PM', scans: 190},
    ]

    const stats = [
        {
            title: 'Total Scans',
            value: '5,420',
            change: '+12.5%',
            trend: 'up',
            description: 'vs last period',
        },
        {
            title: 'Conversion Rate',
            value: '22.8%',
            change: '+3.2%',
            trend: 'up',
            description: 'rewards issued',
        },
        {
            title: 'Avg. Daily Scans',
            value: '678',
            change: '-5.1%',
            trend: 'down',
            description: 'per day',
        },
        {
            title: 'Peak Hour',
            value: '7 PM',
            change: '310 scans',
            trend: 'up',
            description: 'highest activity',
        },
    ]

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
                        <h1 className='text-3xl font-bold tracking-tight'>Campaign Analytics</h1>
                        <p className='text-muted-foreground'>{campaign.name} • {campaign.client}</p>
                    </div>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                    </Badge>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Download className='mr-2 size-4'/>
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            {stat.trend === 'up' ? (
                                <TrendingUp className='size-4 text-green-600'/>
                            ) : (
                                <TrendingDown className='size-4 text-red-600'/>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground'>
                                <span
                                    className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                                >
                                    {stat.change}
                                </span>
                                {' '}{stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <Tabs defaultValue='overview' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='performance'>Branch Performance</TabsTrigger>
                    <TabsTrigger value='rewards'>Reward Distribution</TabsTrigger>
                    <TabsTrigger value='time'>Time Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Scans & Rewards Trend</CardTitle>
                            <CardDescription>Scans and rewards issued over the last 8 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={350}>
                                <LineChart data={dailyScansData}>
                                    <CartesianGrid strokeDasharray='3 3'/>
                                    <XAxis dataKey='date'/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line
                                        type='monotone'
                                        dataKey='scans'
                                        stroke='#8884d8'
                                        strokeWidth={2}
                                        name='Total Scans'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='rewards'
                                        stroke='#82ca9d'
                                        strokeWidth={2}
                                        name='Rewards Issued'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='performance' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Branch Performance Comparison</CardTitle>
                            <CardDescription>Scans and rewards by branch location</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={350}>
                                <BarChart data={branchPerformance}>
                                    <CartesianGrid strokeDasharray='3 3'/>
                                    <XAxis dataKey='branch'/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar dataKey='scans' fill='#8884d8' name='Total Scans'/>
                                    <Bar dataKey='rewards' fill='#82ca9d' name='Rewards Issued'/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='rewards' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Distribution</CardTitle>
                            <CardDescription>Breakdown of rewards issued vs no prizes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={350}>
                                <PieChart>
                                    <Pie
                                        data={rewardDistribution}
                                        cx='50%'
                                        cy='50%'
                                        labelLine={false}
                                        label={({percent}) => `${percent ? (percent * 100).toFixed(0) : 0}%`}
                                        outerRadius={120}
                                        fill='#8884d8'
                                        dataKey='value'
                                    >
                                        {rewardDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='time' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Hourly Scan Distribution</CardTitle>
                            <CardDescription>Customer activity throughout the day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={350}>
                                <BarChart data={hourlyDistribution}>
                                    <CartesianGrid strokeDasharray='3 3'/>
                                    <XAxis dataKey='hour'/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey='scans' fill='#8884d8' name='Scans'/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Summary Cards */}
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Branch</CardTitle>
                        <CardDescription>Branch with highest engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-2xl font-bold'>Main Street</span>
                                <Badge variant='default'>Best</Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-4 pt-4'>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Total Scans</p>
                                    <p className='text-xl font-bold'>1,250</p>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Rewards</p>
                                    <p className='text-xl font-bold'>437</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Most Popular Reward</CardTitle>
                        <CardDescription>Highest issued reward</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-2xl font-bold'>Free Drink</span>
                                <Badge variant='secondary'>Popular</Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-4 pt-4'>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Issued</p>
                                    <p className='text-xl font-bold'>250</p>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Redeemed</p>
                                    <p className='text-xl font-bold'>200</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page
