'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Badge} from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    ArrowLeft,
    Plus,
    Search,
    MoreHorizontal,
    Megaphone,
    TrendingUp,
    Users,
    Award,
    Calendar,
} from 'lucide-react'
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
import {toast} from 'sonner'

const campaignsData = [
    {
        id: 1,
        name: 'Summer Special 2024',
        type: 'Spin Wheel',
        status: 'Active',
        branch: 'Downtown Branch',
        startDate: '2024-06-01',
        endDate: '2024-08-30',
        scans: 12340,
        rewards: 3210,
        conversionRate: 26,
        budget: '$5,000',
        spent: '$3,200',
    },
    {
        id: 2,
        name: 'Weekend Bonus',
        type: 'Scratch Card',
        status: 'Active',
        branch: 'Times Square',
        startDate: '2024-06-15',
        endDate: '2024-07-15',
        scans: 8920,
        rewards: 2150,
        conversionRate: 24,
        budget: '$3,000',
        spent: '$1,800',
    },
    {
        id: 3,
        name: 'New Customer Welcome',
        type: 'Slot Machine',
        status: 'Completed',
        branch: 'Brooklyn Branch',
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        scans: 15630,
        rewards: 4820,
        conversionRate: 31,
        budget: '$8,000',
        spent: '$7,500',
    },
    {
        id: 4,
        name: 'Flash Friday',
        type: 'Spin Wheel',
        status: 'Scheduled',
        branch: 'All Branches',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        scans: 0,
        rewards: 0,
        conversionRate: 0,
        budget: '$10,000',
        spent: '$0',
    },
    {
        id: 5,
        name: 'Holiday Mega Sale',
        type: 'Scratch Card',
        status: 'Draft',
        branch: 'Downtown Branch',
        startDate: '2024-12-15',
        endDate: '2024-12-31',
        scans: 0,
        rewards: 0,
        conversionRate: 0,
        budget: '$15,000',
        spent: '$0',
    },
]

const Page = () => {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedBranch, setSelectedBranch] = useState('all')
    const [activeTab, setActiveTab] = useState('all')

    const filteredCampaigns = campaignsData.filter((campaign) => {
        // Tab filter
        if (activeTab !== 'all' && campaign.status.toLowerCase() !== activeTab) {
            return false
        }

        // Search filter
        if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !campaign.branch.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Type filter
        if (selectedType !== 'all' && campaign.type.toLowerCase().replace(' ', '-') !== selectedType) {
            return false
        }

        // Branch filter
        if (selectedBranch !== 'all' && campaign.branch !== selectedBranch) {
            return false
        }

        return true
    })

    const handleAction = (action: string, campaignName: string, campaignId: number) => {
        switch (action) {
            case 'view':
                router.push(`/campaigns/${campaignId}`)
                break
            case 'edit':
                router.push(`/campaigns/${campaignId}/edit`)
                break
            case 'analytics':
                router.push(`/campaigns/${campaignId}/analytics`)
                break
            case 'duplicate':
                toast.success(`Campaign "${campaignName}" duplicated successfully`)
                break
            case 'pause':
                toast.warning(`Campaign "${campaignName}" has been paused`)
                break
            case 'resume':
                toast.success(`Campaign "${campaignName}" has been resumed`)
                break
            case 'delete':
                toast.error(`Campaign "${campaignName}" has been deleted`)
                break
        }
    }

    const totalScans = campaignsData.reduce((sum, c) => sum + c.scans, 0)
    const totalRewards = campaignsData.reduce((sum, c) => sum + c.rewards, 0)
    const activeCampaigns = campaignsData.filter(c => c.status === 'Active').length

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href={`/clients/${params.id}`}>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Client Campaigns</h1>
                        <p className='text-muted-foreground'>Manage campaigns for Pizza Palace</p>
                    </div>
                </div>
                <Link href='/campaigns/new'>
                    <Button>
                        <Plus className='mr-2 size-4'/>
                        Create Campaign
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Megaphone className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaignsData.length}</div>
                        <p className='text-xs text-muted-foreground'>{activeCampaigns} currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <TrendingUp className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalScans.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Across all campaigns</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Rewards Given</CardTitle>
                        <Award className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalRewards.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Total prizes distributed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Avg. Conversion</CardTitle>
                        <Users className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalScans > 0 ? Math.round((totalRewards / totalScans) * 100) : 0}%
                        </div>
                        <p className='text-xs text-muted-foreground'>Scan to reward rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Campaigns Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Campaigns</CardTitle>
                            <CardDescription>
                                Showing {filteredCampaigns.length} of {campaignsData.length} campaigns
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='active'>Active</TabsTrigger>
                                <TabsTrigger value='scheduled'>Scheduled</TabsTrigger>
                                <TabsTrigger value='completed'>Completed</TabsTrigger>
                                <TabsTrigger value='draft'>Draft</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input
                                        placeholder='Search campaigns...'
                                        className='pl-8 w-[250px]'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Type'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Types</SelectItem>
                                        <SelectItem value='spin-wheel'>Spin Wheel</SelectItem>
                                        <SelectItem value='scratch-card'>Scratch Card</SelectItem>
                                        <SelectItem value='slot-machine'>Slot Machine</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Branch'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Branches</SelectItem>
                                        <SelectItem value='Downtown Branch'>Downtown</SelectItem>
                                        <SelectItem value='Times Square'>Times Square</SelectItem>
                                        <SelectItem value='Brooklyn Branch'>Brooklyn</SelectItem>
                                        <SelectItem value='All Branches'>All Branches</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className='text-right'>Scans</TableHead>
                                        <TableHead className='text-right'>Rewards</TableHead>
                                        <TableHead className='text-right'>Conv. Rate</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCampaigns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className='text-center py-8 text-muted-foreground'>
                                                No campaigns found matching your filters
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{campaign.name}</span>
                                                        <span className='text-xs text-muted-foreground'>
                                                            {campaign.budget} budget • {campaign.spent} spent
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{campaign.type}</Badge>
                                                </TableCell>
                                                <TableCell className='text-sm'>{campaign.branch}</TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                                        <Calendar className='size-3'/>
                                                        <span>{campaign.startDate}</span>
                                                    </div>
                                                    <div className='text-xs text-muted-foreground'>
                                                        to {campaign.endDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-right'>{campaign.scans.toLocaleString()}</TableCell>
                                                <TableCell className='text-right'>{campaign.rewards.toLocaleString()}</TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.conversionRate > 0 ? `${campaign.conversionRate}%` : '-'}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Badge
                                                        variant={
                                                            campaign.status === 'Active'
                                                                ? 'default'
                                                                : campaign.status === 'Completed'
                                                                    ? 'secondary'
                                                                    : campaign.status === 'Scheduled'
                                                                        ? 'outline'
                                                                        : 'secondary'
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
                                                            <DropdownMenuItem onClick={() => handleAction('view', campaign.name, campaign.id)}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('edit', campaign.name, campaign.id)}>
                                                                Edit Campaign
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('analytics', campaign.name, campaign.id)}>
                                                                View Analytics
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('duplicate', campaign.name, campaign.id)}>
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            {campaign.status === 'Active' ? (
                                                                <DropdownMenuItem onClick={() => handleAction('pause', campaign.name, campaign.id)}>
                                                                    Pause Campaign
                                                                </DropdownMenuItem>
                                                            ) : campaign.status === 'Scheduled' || campaign.status === 'Draft' ? (
                                                                <DropdownMenuItem onClick={() => handleAction('resume', campaign.name, campaign.id)}>
                                                                    Start Campaign
                                                                </DropdownMenuItem>
                                                            ) : null}
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleAction('delete', campaign.name, campaign.id)}
                                                            >
                                                                Delete Campaign
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {['active', 'scheduled', 'completed', 'draft'].map((tab) => (
                            <TabsContent key={tab} value={tab}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Branch</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead className='text-right'>Scans</TableHead>
                                            <TableHead className='text-right'>Rewards</TableHead>
                                            <TableHead className='text-right'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCampaigns.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                                                    No {tab} campaigns found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCampaigns.map((campaign) => (
                                                <TableRow key={campaign.id}>
                                                    <TableCell className='font-medium'>{campaign.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant='outline'>{campaign.type}</Badge>
                                                    </TableCell>
                                                    <TableCell className='text-sm'>{campaign.branch}</TableCell>
                                                    <TableCell className='text-sm text-muted-foreground'>
                                                        {campaign.startDate} - {campaign.endDate}
                                                    </TableCell>
                                                    <TableCell className='text-right'>{campaign.scans.toLocaleString()}</TableCell>
                                                    <TableCell className='text-right'>{campaign.rewards.toLocaleString()}</TableCell>
                                                    <TableCell className='text-right'>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant='ghost' size='icon'>
                                                                    <MoreHorizontal className='size-4'/>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align='end'>
                                                                <DropdownMenuItem onClick={() => handleAction('view', campaign.name, campaign.id)}>
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAction('edit', campaign.name, campaign.id)}>
                                                                    Edit Campaign
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAction('analytics', campaign.name, campaign.id)}>
                                                                    View Analytics
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
