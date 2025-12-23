'use client'

import {useState} from 'react'
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
import {Plus, Search, MoreHorizontal, Building2, Megaphone, Store} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {toast} from 'sonner'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

// Static data for clients
const clientsData = [
    {
        id: 1,
        name: 'Pizza Palace',
        dealer: 'John Smith',
        country: 'United States',
        countryCode: 'US',
        branches: 12,
        campaigns: 8,
        status: 'Active',
        subscription: 'Premium',
        joined: '2024-01-20',
        email: 'contact@pizzapalace.com',
    },
    {
        id: 2,
        name: 'Burger King',
        dealer: 'John Smith',
        country: 'United States',
        countryCode: 'US',
        branches: 8,
        campaigns: 5,
        status: 'Active',
        subscription: 'Standard',
        joined: '2024-02-15',
        email: 'info@burgerking.com',
    },
    {
        id: 3,
        name: 'Starbucks Nepal',
        dealer: 'Rajesh Kumar',
        country: 'Nepal',
        countryCode: 'NP',
        branches: 6,
        campaigns: 4,
        status: 'Active',
        subscription: 'Premium',
        joined: '2024-03-10',
        email: 'nepal@starbucks.com',
    },
    {
        id: 4,
        name: 'KFC Australia',
        dealer: 'Sarah Johnson',
        country: 'Australia',
        countryCode: 'AU',
        branches: 15,
        campaigns: 12,
        status: 'Active',
        subscription: 'Enterprise',
        joined: '2024-02-28',
        email: 'au@kfc.com',
    },
    {
        id: 5,
        name: 'Subway UK',
        dealer: 'Emma Wilson',
        country: 'United Kingdom',
        countryCode: 'UK',
        branches: 10,
        campaigns: 7,
        status: 'Active',
        subscription: 'Premium',
        joined: '2024-04-05',
        email: 'uk@subway.com',
    },
    {
        id: 6,
        name: 'Local Diner',
        dealer: 'John Smith',
        country: 'United States',
        countryCode: 'US',
        branches: 2,
        campaigns: 1,
        status: 'Demo',
        subscription: 'Trial',
        joined: '2024-12-15',
        email: 'info@localdiner.com',
    },
    {
        id: 7,
        name: 'Coffee House',
        dealer: 'Rajesh Kumar',
        country: 'Nepal',
        countryCode: 'NP',
        branches: 3,
        campaigns: 2,
        status: 'Expired',
        subscription: 'Standard',
        joined: '2024-06-20',
        email: 'contact@coffeehouse.np',
    },
]

const stats = [
    {
        title: 'Total Clients',
        value: '342',
        icon: Building2,
        description: 'Across all dealers',
    },
    {
        title: 'Total Branches',
        value: '1,284',
        icon: Store,
        description: 'All locations',
    },
    {
        title: 'Active Campaigns',
        value: '127',
        icon: Megaphone,
        description: 'Running now',
    },
]

const Page = () => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('all')
    const [selectedSubscription, setSelectedSubscription] = useState('all')
    const [activeTab, setActiveTab] = useState('all')

    // Filter clients based on all criteria
    const filteredClients = clientsData.filter((client) => {
        // Tab filter
        if (activeTab !== 'all' && client.status.toLowerCase() !== activeTab) {
            return false
        }

        // Search filter
        if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !client.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !client.dealer.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Country filter
        if (selectedCountry !== 'all' && client.countryCode !== selectedCountry) {
            return false
        }

        // Subscription filter
        if (selectedSubscription !== 'all' && client.subscription.toLowerCase() !== selectedSubscription) {
            return false
        }

        return true
    })

    const handleAction = (action: string, clientName: string) => {
        switch (action) {
            case 'view':
                router.push(`/clients/1/edit/`)
                break
            case 'edit':
                router.push(`/clients/1/edit/`)
                break
            case 'branches':
                router.push(`/clients/1/branches/`)
                break
            case 'campaigns':
                router.push(`/clients/1/campains/`)
                break
            case 'upgrade':
                toast.success(`Upgrade plan for ${clientName}`)
                break
            case 'suspend':
                toast.error(`${clientName} has been suspended`)
                break
            case 'convert':
                toast.success(`${clientName} converted to paid plan!`)
                break
            case 'reactivate':
                toast.success(`${clientName} has been reactivated!`)
                break
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Clients Management</h1>
                    <p className='text-muted-foreground'>View and manage all clients across dealers and countries</p>
                </div>
                <Link href='/clients/new'>
                    <Button>
                        <Plus className='mr-2 size-4'/>
                        Add New Client
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
                            <CardTitle>All Clients</CardTitle>
                            <CardDescription>
                                Showing {filteredClients.length} of {clientsData.length} clients
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
                                <TabsTrigger value='demo'>Demo</TabsTrigger>
                                <TabsTrigger value='expired'>Expired</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input
                                        placeholder='Search clients...'
                                        className='pl-8 w-[250px]'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
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
                                <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                                    <SelectTrigger className='w-[150px]'>
                                        <SelectValue placeholder='Subscription'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Plans</SelectItem>
                                        <SelectItem value='trial'>Trial</SelectItem>
                                        <SelectItem value='standard'>Standard</SelectItem>
                                        <SelectItem value='premium'>Premium</SelectItem>
                                        <SelectItem value='enterprise'>Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Branches</TableHead>
                                        <TableHead className='text-right'>Campaigns</TableHead>
                                        <TableHead className='text-right'>Subscription</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                                                No clients found matching your filters
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{client.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{client.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{client.dealer}</TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
                                                        <Badge variant='outline'>{client.countryCode}</Badge>
                                                        <span className='text-sm'>{client.country}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-right'>{client.branches}</TableCell>
                                                <TableCell className='text-right'>{client.campaigns}</TableCell>
                                                <TableCell className='text-right'>
                                                    <Badge
                                                        variant={
                                                            client.subscription === 'Enterprise'
                                                                ? 'default'
                                                                : client.subscription === 'Premium'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                        }
                                                    >
                                                        {client.subscription}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Badge
                                                        variant={
                                                            client.status === 'Active'
                                                                ? 'default'
                                                                : client.status === 'Demo'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                    >
                                                        {client.status}
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
                                                            <DropdownMenuItem onClick={() => handleAction('view', client.name)}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('edit', client.name)}>
                                                                Edit Client
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('branches', client.name)}>
                                                                View Branches
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('campaigns', client.name)}>
                                                                View Campaigns
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleAction('suspend', client.name)}
                                                            >
                                                                Suspend Client
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

                        <TabsContent value='active'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Branches</TableHead>
                                        <TableHead className='text-right'>Campaigns</TableHead>
                                        <TableHead className='text-right'>Subscription</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                                                No active clients found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{client.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{client.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{client.dealer}</TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{client.countryCode}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>{client.branches}</TableCell>
                                                <TableCell className='text-right'>{client.campaigns}</TableCell>
                                                <TableCell className='text-right'>
                                                    <Badge>{client.subscription}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant='ghost' size='icon'>
                                                                <MoreHorizontal className='size-4'/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align='end'>
                                                            <DropdownMenuItem onClick={() => handleAction('view', client.name)}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('edit', client.name)}>
                                                                Edit Client
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('campaigns', client.name)}>
                                                                View Campaigns
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

                        <TabsContent value='demo'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Joined</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                                                No demo clients found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{client.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{client.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{client.dealer}</TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{client.countryCode}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right text-sm text-muted-foreground'>
                                                    {client.joined}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => handleAction('convert', client.name)}
                                                    >
                                                        Convert to Paid
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='expired'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Last Active</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                                                No expired clients found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{client.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{client.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{client.dealer}</TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{client.countryCode}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right text-sm text-muted-foreground'>
                                                    {client.joined}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => handleAction('reactivate', client.name)}
                                                    >
                                                        Reactivate
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
