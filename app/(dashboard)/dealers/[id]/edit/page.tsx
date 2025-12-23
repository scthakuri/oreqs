'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
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
import {ArrowLeft, MessageSquare} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'

const Page = ({params}: { params: { id: string } }) => {
    const [showSmsDialog, setShowSmsDialog] = useState(false)
    const [showSuspendDialog, setShowSuspendDialog] = useState(false)
    const [smsAmount, setSmsAmount] = useState('5000')

    // Mock data
    const dealer = {
        id: params.id,
        name: 'John Smith',
        email: 'john.smith@oreqs.us',
        phone: '+1 234 567 8900',
        company: 'OREQS Partners Inc.',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        status: 'Active',
        smsCredits: 15000,
    }

    const presetAmounts = [1000, 5000, 10000, 25000, 50000]

    const handleSave = () => {
        toast.success('Dealer updated successfully!')
    }

    const handleAddCredits = () => {
        setShowSmsDialog(false)
        toast.success(`Added ${Number(smsAmount).toLocaleString()} SMS credits successfully!`)
    }

    const handleSuspend = () => {
        setShowSuspendDialog(false)
        toast.warning('Dealer suspended successfully')
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/dealers'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div className='flex-1'>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Dealer</h1>
                    <p className='text-muted-foreground'>Update dealer information</p>
                </div>
                <Badge variant={dealer.status === 'Active' ? 'default' : 'secondary'}>
                    {dealer.status}
                </Badge>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dealer Information</CardTitle>
                            <CardDescription>Update the dealer's basic information</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Full Name *</Label>
                                    <Input id='name' defaultValue={dealer.name}/>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email Address *</Label>
                                    <Input id='email' type='email' defaultValue={dealer.email}/>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='phone'>Phone Number *</Label>
                                <Input id='phone' defaultValue={dealer.phone}/>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Company Details</h3>
                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='company'>Company Name</Label>
                                        <Input id='company' defaultValue={dealer.company}/>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address'>Address</Label>
                                        <Input id='address' defaultValue={dealer.address}/>
                                    </div>
                                    <div className='grid gap-4 md:grid-cols-3'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='city'>City</Label>
                                            <Input id='city' defaultValue={dealer.city}/>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='state'>State/Province</Label>
                                            <Input id='state' defaultValue={dealer.state}/>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='zip'>ZIP/Postal Code</Label>
                                            <Input id='zip' defaultValue={dealer.zip}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Account Settings</h3>
                                <div className='space-y-2'>
                                    <Label htmlFor='status'>Status *</Label>
                                    <Select defaultValue={dealer.status.toLowerCase()}>
                                        <SelectTrigger id='status'>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='active'>Active</SelectItem>
                                            <SelectItem value='inactive'>Inactive</SelectItem>
                                            <SelectItem value='suspended'>Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>SMS Credits</h3>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Available Credits</CardTitle>
                                        <MessageSquare className='size-4 text-muted-foreground'/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>{dealer.smsCredits.toLocaleString()}</div>
                                        <p className='text-xs text-muted-foreground mt-1'>SMS Credits</p>
                                        <Button
                                            variant='outline'
                                            className='mt-4 w-full'
                                            onClick={() => setShowSmsDialog(true)}
                                        >
                                            Add SMS Credits
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='lg:col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Button className='w-full' onClick={handleSave}>
                                Save Changes
                            </Button>
                            <Link href='/dealers'>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Separator/>
                            <Link href={`/dealers/${params.id}`}>
                                <Button variant='ghost' className='w-full'>
                                    View Details
                                </Button>
                            </Link>
                            <Separator/>
                            <Button
                                variant='destructive'
                                className='w-full'
                                onClick={() => setShowSuspendDialog(true)}
                            >
                                Suspend Dealer
                            </Button>
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

            {/* Suspend Dealer Confirmation Dialog */}
            <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will suspend {dealer.name}'s account. They will not be able to access the platform until
                            reactivated. All their clients will also be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSuspend} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            Suspend Dealer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
