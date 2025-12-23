'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Badge} from '@/components/ui/badge'
import {TrendingUp, TrendingDown, Users, Scan, Gift, MessageSquare} from 'lucide-react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

// Static data for charts
const scansOverTime = [
    {date: 'Jan 01', scans: 4200, rewards: 1200, redemptions: 950},
    {date: 'Jan 08', scans: 5800, rewards: 1600, redemptions: 1300},
    {date: 'Jan 15', scans: 7200, rewards: 2100, redemptions: 1850},
    {date: 'Jan 22', scans: 8900, rewards: 2700, redemptions: 2350},
    {date: 'Jan 29', scans: 12400, rewards: 3800, redemptions: 3200},
    {date: 'Feb 05', scans: 15200, rewards: 4500, redemptions: 3900},
    {date: 'Feb 12', scans: 18400, rewards: 5600, redemptions: 4800},
]

const countryDistribution = [
    {country: 'United States', value: 45, color: '#3b82f6'},
    {country: 'United Kingdom', value: 25, color: '#10b981'},
    {country: 'Australia', value: 20, color: '#f59e0b'},
    {country: 'Nepal', value: 10, color: '#8b5cf6'},
]

const campaignTypeData = [
    {type: 'Scratch Card', count: 52},
    {type: 'Spin Wheel', count: 38},
    {type: 'Slot Machine', count: 37},
]

const topPerformers = [
    {name: 'Pizza Palace', scans: 15420, rewards: 4234, country: 'US'},
    {name: 'Burger King', scans: 12280, rewards: 3180, country: 'US'},
    {name: 'Starbucks Nepal', scans: 10890, rewards: 3120, country: 'NP'},
    {name: 'KFC Australia', scans: 9240, rewards: 2890, country: 'AU'},
    {name: 'Subway UK', scans: 7950, rewards: 2150, country: 'UK'},
]

const rewardTrends = [
    {month: 'Jan', issued: 4200, redeemed: 3500, expired: 200},
    {month: 'Feb', issued: 5800, redeemed: 4900, expired: 350},
    {month: 'Mar', issued: 7200, redeemed: 6100, expired: 420},
    {month: 'Apr', issued: 8900, redeemed: 7500, expired: 580},
    {month: 'May', issued: 12400, redeemed: 10200, expired: 890},
    {month: 'Jun', issued: 15200, redeemed: 12800, expired: 1120},
]

const kpis = [
    {
        title: 'Total Scans',
        value: '245.8K',
        change: '+34.2%',
        trend: 'up',
        icon: Scan,
    },
    {
        title: 'Avg. Scans/Campaign',
        value: '1,934',
        change: '+12.5%',
        trend: 'up',
        icon: TrendingUp,
    },
    {
        title: 'Reward Win Rate',
        value: '28.4%',
        change: '+2.1%',
        trend: 'up',
        icon: Gift,
    },
    {
        title: 'Redemption Rate',
        value: '84.2%',
        change: '-1.3%',
        trend: 'down',
        icon: TrendingDown,
    },
]

const Page = () => {
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Analytics & Insights</h1>
                    <p className='text-muted-foreground'>System-wide analytics and performance metrics</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Select defaultValue='7days'>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Time period'/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='7days'>Last 7 days</SelectItem>
                            <SelectItem value='30days'>Last 30 days</SelectItem>
                            <SelectItem value='90days'>Last 90 days</SelectItem>
                            <SelectItem value='year'>This year</SelectItem>
                        </SelectContent>
                    </Select>
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
                </div>
            </div>

            {/* KPI Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {kpis.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{kpi.title}</CardTitle>
                            <kpi.icon className='size-4 text-muted-foreground'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{kpi.value}</div>
                            <div className='flex items-center gap-2 mt-2'>
                                <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className='text-xs'>
                                    {kpi.change}
                                </Badge>
                                <span className='text-xs text-muted-foreground'>vs last period</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Charts */}
            <Tabs defaultValue='overview' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='campaigns'>Campaigns</TabsTrigger>
                    <TabsTrigger value='rewards'>Rewards</TabsTrigger>
                    <TabsTrigger value='geography'>Geography</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='space-y-4'>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Scans & Engagement Trend</CardTitle>
                                <CardDescription>Daily scans and reward issuance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={350}>
                                    <AreaChart data={scansOverTime}>
                                        <CartesianGrid strokeDasharray='3 3'/>
                                        <XAxis dataKey='date' tick={{fontSize: 12}}/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Area
                                            type='monotone'
                                            dataKey='scans'
                                            stackId='1'
                                            stroke='hsl(var(--primary))'
                                            fill='hsl(var(--primary))'
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type='monotone'
                                            dataKey='rewards'
                                            stackId='2'
                                            stroke='hsl(var(--chart-2))'
                                            fill='hsl(var(--chart-2))'
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Type Distribution</CardTitle>
                                <CardDescription>Active campaigns by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={350}>
                                    <BarChart data={campaignTypeData}>
                                        <CartesianGrid strokeDasharray='3 3'/>
                                        <XAxis dataKey='type' tick={{fontSize: 12}}/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Bar dataKey='count' fill='hsl(var(--primary))'/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value='campaigns' className='space-y-4'>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Clients</CardTitle>
                                <CardDescription>Clients ranked by total scans</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {topPerformers.map((client, index) => (
                                        <div key={client.name} className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <div className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className='font-medium'>{client.name}</p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {client.scans.toLocaleString()} scans
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Badge variant='outline'>{client.country}</Badge>
                                                <span className='text-sm font-medium text-muted-foreground'>
                                                    {client.rewards.toLocaleString()} rewards
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Performance</CardTitle>
                                <CardDescription>Scans vs Rewards over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={350}>
                                    <LineChart data={scansOverTime}>
                                        <CartesianGrid strokeDasharray='3 3'/>
                                        <XAxis dataKey='date' tick={{fontSize: 12}}/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Line
                                            type='monotone'
                                            dataKey='scans'
                                            stroke='hsl(var(--primary))'
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type='monotone'
                                            dataKey='rewards'
                                            stroke='hsl(var(--chart-2))'
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type='monotone'
                                            dataKey='redemptions'
                                            stroke='hsl(var(--chart-3))'
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value='rewards' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Lifecycle</CardTitle>
                            <CardDescription>Issued, redeemed, and expired rewards over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={400}>
                                <BarChart data={rewardTrends}>
                                    <CartesianGrid strokeDasharray='3 3'/>
                                    <XAxis dataKey='month'/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar dataKey='issued' fill='hsl(var(--primary))' name='Issued'/>
                                    <Bar dataKey='redeemed' fill='hsl(var(--chart-2))' name='Redeemed'/>
                                    <Bar dataKey='expired' fill='hsl(var(--chart-5))' name='Expired'/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='geography' className='space-y-4'>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribution by Country</CardTitle>
                                <CardDescription>Campaign distribution across countries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={350}>
                                    <PieChart>
                                        <Pie
                                            data={countryDistribution}
                                            cx='50%'
                                            cy='50%'
                                            labelLine={false}
                                            label={({country, percent}) => `${country}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill='#8884d8'
                                            dataKey='value'
                                        >
                                            {countryDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Country Performance</CardTitle>
                                <CardDescription>Campaigns by country</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {countryDistribution.map((country) => (
                                        <div key={country.country} className='space-y-2'>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-medium'>{country.country}</span>
                                                <span className='text-sm text-muted-foreground'>{country.value}%</span>
                                            </div>
                                            <div className='h-2 overflow-hidden rounded-full bg-secondary'>
                                                <div
                                                    className='h-full rounded-full transition-all'
                                                    style={{
                                                        width: `${country.value}%`,
                                                        backgroundColor: country.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page
