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
import {Label} from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Plus, Search, MoreHorizontal, Users, Building2, DollarSign} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {Separator} from '@/components/ui/separator'
import Link from 'next/link'
import {toast} from 'sonner'

// Static data for dealers
const dealersData = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@oreqs.us',
        country: 'United States',
        countryCode: 'US',
        clients: 45,
        status: 'Active',
        smsCredits: 15000,
        joined: '2024-01-15',
        revenue: '$12,450',
    },
    {
        id: 2,
        name: 'Emma Wilson',
        email: 'emma.wilson@oreqs.uk',
        country: 'United Kingdom',
        countryCode: 'UK',
        clients: 32,
        status: 'Active',
        smsCredits: 12500,
        joined: '2024-02-20',
        revenue: '$9,820',
    },
    {
        id: 3,
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@oreqs.com.np',
        country: 'Nepal',
        countryCode: 'NP',
        clients: 28,
        status: 'Active',
        smsCredits: 8000,
        joined: '2024-03-10',
        revenue: '$6,750',
    },
    {
        id: 4,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@oreqs.au',
        country: 'Australia',
        countryCode: 'AU',
        clients: 19,
        status: 'Active',
        smsCredits: 7500,
        joined: '2024-04-05',
        revenue: '$5,230',
    },
    {
        id: 5,
        name: 'Michael Brown',
        email: 'michael.brown@oreqs.us',
        country: 'United States',
        countryCode: 'US',
        clients: 15,
        status: 'Suspended',
        smsCredits: 2000,
        joined: '2024-05-12',
        revenue: '$3,120',
    },
    {
        id: 6,
        name: 'Priya Sharma',
        email: 'priya.sharma@oreqs.com.np',
        country: 'Nepal',
        countryCode: 'NP',
        clients: 12,
        status: 'Active',
        smsCredits: 5500,
        joined: '2024-06-18',
        revenue: '$2,890',
    },
]

const stats = [
    {
        title: 'Total Dealers',
        value: '24',
        icon: Users,
        description: 'Across all countries',
    },
    {
        title: 'Total Clients',
        value: '342',
        icon: Building2,
        description: 'Under all dealers',
    },
    {
        title: 'Total Revenue',
        value: '$82,450',
        icon: DollarSign,
        description: 'This month',
    },
]

const Page = () => {
    const [showSmsDialog, setShowSmsDialog] = useState(false)
    const [showSuspendDialog, setShowSuspendDialog] = useState(false)
    const [smsAmount, setSmsAmount] = useState('5000')
    const [selectedDealer, setSelectedDealer] = useState<typeof dealersData[0] | null>(null)

    const presetAmounts = [1000, 5000, 10000, 25000, 50000]

    const handleAddCredits = () => {
        setShowSmsDialog(false)
        toast.success(`Added ${Number(smsAmount).toLocaleString()} SMS credits to ${selectedDealer?.name}!`)
        setSmsAmount('5000')
        setSelectedDealer(null)
    }

    const handleOpenSmsDialog = (dealer: typeof dealersData[0]) => {
        setSelectedDealer(dealer)
        setSmsAmount('5000')
        setShowSmsDialog(true)
    }

    const handleOpenSuspendDialog = (dealer: typeof dealersData[0]) => {
        setSelectedDealer(dealer)
        setShowSuspendDialog(true)
    }

    const handleSuspend = () => {
        setShowSuspendDialog(false)
        toast.warning(`${selectedDealer?.name} has been suspended successfully`)
        setSelectedDealer(null)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Dealers Management</h1>
                    <p className='text-muted-foreground'>Manage dealers and their clients across all countries</p>
                </div>
                <Link href='/dealers/new'>
                    <Button>
                        <Plus className='mr-2 size-4'/>
                        Add New Dealer
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
                            <CardTitle>All Dealers</CardTitle>
                            <CardDescription>View and manage all registered dealers</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue='all' className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='active'>Active</TabsTrigger>
                                <TabsTrigger value='suspended'>Suspended</TabsTrigger>
                            </TabsList>
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                    <Input placeholder='Search dealers...' className='pl-8 w-[250px]'/>
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
                            </div>
                        </div>

                        <TabsContent value='all' className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Clients</TableHead>
                                        <TableHead className='text-right'>SMS Credits</TableHead>
                                        <TableHead className='text-right'>Revenue</TableHead>
                                        <TableHead className='text-right'>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dealersData.map((dealer) => (
                                        <TableRow key={dealer.id}>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{dealer.name}</span>
                                                    <span className='text-sm text-muted-foreground'>{dealer.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <Badge variant='outline'>{dealer.countryCode}</Badge>
                                                    <span className='text-sm'>{dealer.country}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-right'>{dealer.clients}</TableCell>
                                            <TableCell className='text-right'>{dealer.smsCredits.toLocaleString()}</TableCell>
                                            <TableCell className='text-right font-medium'>{dealer.revenue}</TableCell>
                                            <TableCell className='text-right'>
                                                <Badge variant={dealer.status === 'Active' ? 'default' : 'destructive'}>
                                                    {dealer.status}
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
                                                            <Link href={`/dealers/${dealer.id}`}>
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dealers/${dealer.id}/edit`}>
                                                                Edit Dealer
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleOpenSmsDialog(dealer)}>
                                                            Add SMS Credits
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='text-destructive'
                                                            onClick={() => handleOpenSuspendDialog(dealer)}
                                                        >
                                                            Suspend Dealer
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
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Clients</TableHead>
                                        <TableHead className='text-right'>SMS Credits</TableHead>
                                        <TableHead className='text-right'>Revenue</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dealersData
                                        .filter((d) => d.status === 'Active')
                                        .map((dealer) => (
                                            <TableRow key={dealer.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{dealer.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{dealer.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{dealer.countryCode}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>{dealer.clients}</TableCell>
                                                <TableCell className='text-right'>
                                                    {dealer.smsCredits.toLocaleString()}
                                                </TableCell>
                                                <TableCell className='text-right font-medium'>{dealer.revenue}</TableCell>
                                                <TableCell className='text-right'>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant='ghost' size='icon'>
                                                                <MoreHorizontal className='size-4'/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align='end'>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dealers/${dealer.id}`}>
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dealers/${dealer.id}/edit`}>
                                                                    Edit Dealer
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenSmsDialog(dealer)}>
                                                                Add SMS Credits
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleOpenSuspendDialog(dealer)}
                                                            >
                                                                Suspend Dealer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value='suspended'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dealer</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead className='text-right'>Clients</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dealersData
                                        .filter((d) => d.status === 'Suspended')
                                        .map((dealer) => (
                                            <TableRow key={dealer.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{dealer.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{dealer.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant='outline'>{dealer.countryCode}</Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>{dealer.clients}</TableCell>
                                                <TableCell className='text-right'>
                                                    <Button variant='outline' size='sm'>
                                                        Reactivate
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Add SMS Credits Dialog */}
            <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
                <DialogContent className='sm:max-w-[500px]'>
                    <DialogHeader>
                        <DialogTitle>Add SMS Credits</DialogTitle>
                        <DialogDescription>
                            Add SMS credits to {selectedDealer?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='credits'>Number of Credits</Label>
                            <Input
                                id='credits'
                                type='number'
                                value={smsAmount}
                                onChange={(e) => setSmsAmount(e.target.value)}
                                placeholder='Enter amount'
                            />
                        </div>
                        <div>
                            <Label className='mb-2 block text-sm'>Quick Select</Label>
                            <div className='grid grid-cols-3 gap-2'>
                                {presetAmounts.map((amount) => (
                                    <Button
                                        key={amount}
                                        variant='outline'
                                        size='sm'
                                        onClick={() => setSmsAmount(amount.toString())}
                                    >
                                        {amount.toLocaleString()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className='rounded-lg border p-3 space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>Current Balance:</span>
                                <span className='font-medium'>{selectedDealer?.smsCredits.toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>Adding:</span>
                                <span className='font-medium'>+{Number(smsAmount || 0).toLocaleString()}</span>
                            </div>
                            <Separator/>
                            <div className='flex justify-between'>
                                <span className='font-medium'>New Balance:</span>
                                <span className='text-lg font-bold'>
                                    {((selectedDealer?.smsCredits || 0) + Number(smsAmount || 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setShowSmsDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCredits}>Add Credits</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Dealer Confirmation Dialog */}
            <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will suspend {selectedDealer?.name}'s account. They will not be able to access the
                            platform until reactivated. All their clients will also be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSuspend}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Suspend Dealer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
