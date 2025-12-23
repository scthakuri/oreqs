'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Separator} from '@/components/ui/separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {ArrowLeft, Edit, Mail, Phone, Building2, MapPin, DollarSign, MessageSquare} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'

const Page = ({params}: { params: { id: string } }) => {
    const [showSmsDialog, setShowSmsDialog] = useState(false)
    const [smsAmount, setSmsAmount] = useState('5000')

    // Mock data
    const dealer = {
        id: params.id,
        name: 'John Smith',
        email: 'john.smith@oreqs.us',
        phone: '+1 234 567 8900',
        country: 'United States',
        countryCode: 'US',
        company: 'OREQS Partners Inc.',
        address: '123 Main Street, New York, NY 10001',
        status: 'Active',
        commission: 20,
        smsCredits: 15000,
        usedCredits: 8500,
        costPerSms: 0.05,
        joined: '2024-01-15',
        totalClients: 45,
        activeClients: 42,
        revenue: '$12,450',
    }

    const clients = [
        {name: 'Pizza Palace', branches: 12, campaigns: 8, status: 'Active'},
        {name: 'Burger King', branches: 8, campaigns: 5, status: 'Active'},
        {name: 'Taco Bell', branches: 6, campaigns: 3, status: 'Active'},
        {name: 'Subway', branches: 4, campaigns: 2, status: 'Demo'},
    ]

    const smsHistory = [
        {date: '2024-12-20', credits: 5000, type: 'Added', by: 'Super Admin'},
        {date: '2024-12-15', credits: -2500, type: 'Used', by: 'System'},
        {date: '2024-12-10', credits: 10000, type: 'Added', by: 'Super Admin'},
        {date: '2024-12-05', credits: -1500, type: 'Used', by: 'System'},
    ]

    const presetAmounts = [1000, 5000, 10000, 25000, 50000]

    const handleAddCredits = () => {
        setShowSmsDialog(false)
        toast.success(`Added ${Number(smsAmount).toLocaleString()} SMS credits successfully!`)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href='/dealers'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{dealer.name}</h1>
                        <p className='text-muted-foreground'>{dealer.company}</p>
                    </div>
                    <Badge variant={dealer.status === 'Active' ? 'default' : 'secondary'}>
                        {dealer.status}
                    </Badge>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => setShowSmsDialog(true)}>
                        Add SMS Credits
                    </Button>
                    <Link href={`/dealers/${params.id}/edit`}>
                        <Button>
                            <Edit className='mr-2 size-4'/>
                            Edit Dealer
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.totalClients}</div>
                        <p className='text-xs text-muted-foreground'>{dealer.activeClients} active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>SMS Credits</CardTitle>
                        <MessageSquare className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.smsCredits.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>{dealer.usedCredits.toLocaleString()} used</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                        <DollarSign className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.revenue}</div>
                        <p className='text-xs text-muted-foreground'>This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Commission</CardTitle>
                        <DollarSign className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.commission}%</div>
                        <p className='text-xs text-muted-foreground'>Per transaction</p>
                    </CardContent>
                </Card>
            </div>

            {/* Details Section */}
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Tabs defaultValue='clients' className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='clients'>Clients</TabsTrigger>
                            <TabsTrigger value='sms'>SMS History</TabsTrigger>
                            <TabsTrigger value='activity'>Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value='clients'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Clients</CardTitle>
                                    <CardDescription>All clients under this dealer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Client Name</TableHead>
                                                <TableHead className='text-right'>Branches</TableHead>
                                                <TableHead className='text-right'>Campaigns</TableHead>
                                                <TableHead className='text-right'>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clients.map((client, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className='font-medium'>{client.name}</TableCell>
                                                    <TableCell className='text-right'>{client.branches}</TableCell>
                                                    <TableCell className='text-right'>{client.campaigns}</TableCell>
                                                    <TableCell className='text-right'>
                                                        <Badge
                                                            variant={client.status === 'Active' ? 'default' : 'secondary'}>
                                                            {client.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='sms'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>SMS Credits History</CardTitle>
                                    <CardDescription>Credits added and used over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className='text-right'>Credits</TableHead>
                                                <TableHead className='text-right'>By</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {smsHistory.map((entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{entry.date}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={entry.type === 'Added' ? 'default' : 'secondary'}>
                                                            {entry.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        <span
                                                            className={entry.credits > 0 ? 'text-green-600' : 'text-red-600'}>
                                                            {entry.credits > 0 ? '+' : ''}{entry.credits.toLocaleString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className='text-right text-muted-foreground'>
                                                        {entry.by}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='activity'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest actions and updates</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-4'>
                                        <div className='flex items-start gap-4'>
                                            <div className='size-2 rounded-full bg-primary mt-2'/>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium'>Added 5,000 SMS credits</p>
                                                <p className='text-xs text-muted-foreground'>2 days ago</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='size-2 rounded-full bg-primary mt-2'/>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium'>New client added: Subway</p>
                                                <p className='text-xs text-muted-foreground'>1 week ago</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='size-2 rounded-full bg-muted mt-2'/>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium'>Profile updated</p>
                                                <p className='text-xs text-muted-foreground'>2 weeks ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className='lg:col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <Mail className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Email</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.email}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Phone className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Phone</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.phone}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <MapPin className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Address</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.address}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Building2 className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Country</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.country}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Member Since</p>
                                <p className='text-sm text-muted-foreground'>{dealer.joined}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add SMS Credits Dialog */}
            <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
                <DialogContent className='sm:max-w-[500px]'>
                    <DialogHeader>
                        <DialogTitle>Add SMS Credits</DialogTitle>
                        <DialogDescription>
                            Add SMS credits to {dealer.name}
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
                                <span className='font-medium'>{dealer.smsCredits.toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>Adding:</span>
                                <span className='font-medium'>+{Number(smsAmount || 0).toLocaleString()}</span>
                            </div>
                            <Separator/>
                            <div className='flex justify-between'>
                                <span className='font-medium'>New Balance:</span>
                                <span className='text-lg font-bold'>
                                    {(dealer.smsCredits + Number(smsAmount || 0)).toLocaleString()}
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
        </div>
    )
}

export default Page
