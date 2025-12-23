'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {ArrowLeft, Plus, Search, MoreHorizontal, MapPin, Store, Megaphone, QrCode} from 'lucide-react'
import Link from 'next/link'
import {useParams} from 'next/navigation'
import {toast} from 'sonner'

const branchesData = [
    {
        id: 1,
        name: 'Downtown Branch',
        address: '123 Main St, New York, NY 10001',
        phone: '+1 234 567 8900',
        manager: 'John Doe',
        email: 'downtown@pizzapalace.com',
        status: 'Active',
        campaigns: 3,
        totalScans: 12340,
        qrCode: 'QR-001-DT',
    },
    {
        id: 2,
        name: 'Times Square',
        address: '456 Broadway, New York, NY 10036',
        phone: '+1 234 567 8901',
        manager: 'Jane Smith',
        email: 'timessquare@pizzapalace.com',
        status: 'Active',
        campaigns: 2,
        totalScans: 8920,
        qrCode: 'QR-002-TS',
    },
    {
        id: 3,
        name: 'Brooklyn Branch',
        address: '789 Atlantic Ave, Brooklyn, NY 11217',
        phone: '+1 234 567 8902',
        manager: 'Mike Johnson',
        email: 'brooklyn@pizzapalace.com',
        status: 'Active',
        campaigns: 1,
        totalScans: 5630,
        qrCode: 'QR-003-BK',
    },
    {
        id: 4,
        name: 'Queens Branch',
        address: '321 Queens Blvd, Queens, NY 11375',
        phone: '+1 234 567 8903',
        manager: 'Sarah Wilson',
        email: 'queens@pizzapalace.com',
        status: 'Inactive',
        campaigns: 0,
        totalScans: 0,
        qrCode: 'QR-004-QN',
    },
]

const Page = () => {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: '',
        manager: '',
        email: '',
    })

    const filteredBranches = branchesData.filter((branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.manager.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddBranch = () => {
        if (!newBranch.name.trim()) {
            toast.error('Branch name is required')
            return
        }
        if (!newBranch.address.trim()) {
            toast.error('Branch address is required')
            return
        }

        toast.success('Branch added successfully!', {
            description: `${newBranch.name} has been created.`
        })

        setShowAddDialog(false)
        setNewBranch({
            name: '',
            address: '',
            phone: '',
            manager: '',
            email: '',
        })
    }

    const handleAction = (action: string, branchName: string) => {
        switch (action) {
            case 'view':
                toast.info(`Viewing details for ${branchName}`)
                break
            case 'edit':
                toast.info(`Editing ${branchName}`)
                break
            case 'qr':
                toast.success(`Generating QR code for ${branchName}`)
                break
            case 'campaigns':
                toast.info(`Viewing campaigns for ${branchName}`)
                break
            case 'deactivate':
                toast.warning(`${branchName} has been deactivated`)
                break
            case 'activate':
                toast.success(`${branchName} has been activated`)
                break
            case 'delete':
                toast.error(`${branchName} has been deleted`)
                break
        }
    }

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
                        <h1 className='text-3xl font-bold tracking-tight'>Branch Management</h1>
                        <p className='text-muted-foreground'>Manage locations and branches for Pizza Palace</p>
                    </div>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className='mr-2 size-4'/>
                            Add Branch
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[500px]'>
                        <DialogHeader>
                            <DialogTitle>Add New Branch</DialogTitle>
                            <DialogDescription>
                                Create a new branch location for this client
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='branchName'>Branch Name *</Label>
                                <Input
                                    id='branchName'
                                    placeholder='Downtown Branch'
                                    value={newBranch.name}
                                    onChange={(e) => setNewBranch(prev => ({...prev, name: e.target.value}))}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='branchAddress'>Address *</Label>
                                <Input
                                    id='branchAddress'
                                    placeholder='123 Main St, City, State ZIP'
                                    value={newBranch.address}
                                    onChange={(e) => setNewBranch(prev => ({...prev, address: e.target.value}))}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='branchPhone'>Phone</Label>
                                <Input
                                    id='branchPhone'
                                    placeholder='+1 234 567 8900'
                                    value={newBranch.phone}
                                    onChange={(e) => setNewBranch(prev => ({...prev, phone: e.target.value}))}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='branchManager'>Manager Name</Label>
                                <Input
                                    id='branchManager'
                                    placeholder='John Doe'
                                    value={newBranch.manager}
                                    onChange={(e) => setNewBranch(prev => ({...prev, manager: e.target.value}))}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='branchEmail'>Email</Label>
                                <Input
                                    id='branchEmail'
                                    type='email'
                                    placeholder='branch@client.com'
                                    value={newBranch.email}
                                    onChange={(e) => setNewBranch(prev => ({...prev, email: e.target.value}))}
                                />
                            </div>
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button variant='outline' onClick={() => setShowAddDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddBranch}>
                                Create Branch
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Branches</CardTitle>
                        <Store className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{branchesData.length}</div>
                        <p className='text-xs text-muted-foreground'>All locations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Active Branches</CardTitle>
                        <Store className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {branchesData.filter(b => b.status === 'Active').length}
                        </div>
                        <p className='text-xs text-muted-foreground'>Currently operational</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Megaphone className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {branchesData.reduce((sum, b) => sum + b.campaigns, 0)}
                        </div>
                        <p className='text-xs text-muted-foreground'>Across all branches</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Scans</CardTitle>
                        <QrCode className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {branchesData.reduce((sum, b) => sum + b.totalScans, 0).toLocaleString()}
                        </div>
                        <p className='text-xs text-muted-foreground'>All-time scans</p>
                    </CardContent>
                </Card>
            </div>

            {/* Branches Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Branches</CardTitle>
                            <CardDescription>
                                Showing {filteredBranches.length} of {branchesData.length} branches
                            </CardDescription>
                        </div>
                        <div className='relative'>
                            <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search branches...'
                                className='pl-8 w-[250px]'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Branch</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead>QR Code</TableHead>
                                <TableHead className='text-right'>Campaigns</TableHead>
                                <TableHead className='text-right'>Scans</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBranches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                                        No branches found matching your search
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBranches.map((branch) => (
                                    <TableRow key={branch.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>{branch.name}</span>
                                                <span className='text-sm text-muted-foreground'>{branch.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex items-start gap-2'>
                                                <MapPin className='size-4 text-muted-foreground mt-0.5'/>
                                                <span className='text-sm'>{branch.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium'>{branch.manager}</span>
                                                <span className='text-xs text-muted-foreground'>{branch.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant='outline' className='font-mono text-xs'>
                                                {branch.qrCode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>{branch.campaigns}</TableCell>
                                        <TableCell className='text-right'>{branch.totalScans.toLocaleString()}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={branch.status === 'Active' ? 'default' : 'secondary'}>
                                                {branch.status}
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
                                                    <DropdownMenuItem onClick={() => handleAction('view', branch.name)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction('edit', branch.name)}>
                                                        Edit Branch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction('qr', branch.name)}>
                                                        Generate QR Code
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction('campaigns', branch.name)}>
                                                        View Campaigns
                                                    </DropdownMenuItem>
                                                    {branch.status === 'Active' ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction('deactivate', branch.name)}
                                                        >
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction('activate', branch.name)}
                                                        >
                                                            Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className='text-destructive'
                                                        onClick={() => handleAction('delete', branch.name)}
                                                    >
                                                        Delete Branch
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
