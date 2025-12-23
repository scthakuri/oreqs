'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
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
import {Switch} from '@/components/ui/switch'
import {Globe, Plus, Search, MoreHorizontal, Upload, X, Flag} from 'lucide-react'
import {toast} from 'sonner'

const countriesData = [
    {
        id: 1,
        name: 'United States',
        code: 'US',
        dialCode: '+1',
        currency: 'USD',
        flag: '🇺🇸',
        flagUrl: '',
        isActive: true,
        clients: 45,
        dealers: 12,
    },
    {
        id: 2,
        name: 'United Kingdom',
        code: 'UK',
        dialCode: '+44',
        currency: 'GBP',
        flag: '🇬🇧',
        flagUrl: '',
        isActive: true,
        clients: 28,
        dealers: 8,
    },
    {
        id: 3,
        name: 'Australia',
        code: 'AU',
        dialCode: '+61',
        currency: 'AUD',
        flag: '🇦🇺',
        flagUrl: '',
        isActive: true,
        clients: 15,
        dealers: 5,
    },
    {
        id: 4,
        name: 'Nepal',
        code: 'NP',
        dialCode: '+977',
        currency: 'NPR',
        flag: '🇳🇵',
        flagUrl: '',
        isActive: true,
        clients: 8,
        dealers: 3,
    },
    {
        id: 5,
        name: 'India',
        code: 'IN',
        dialCode: '+91',
        currency: 'INR',
        flag: '🇮🇳',
        flagUrl: '',
        isActive: false,
        clients: 0,
        dealers: 0,
    },
]

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [editingCountry, setEditingCountry] = useState<any>(null)
    const [countries, setCountries] = useState(countriesData)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        dialCode: '',
        currency: '',
        flagUrl: '',
        isActive: true,
    })

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.currency.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const handleFlagUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 1 * 1024 * 1024) {
                toast.error('Flag image size should be less than 1MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                handleInputChange('flagUrl', reader.result as string)
                toast.success('Flag uploaded successfully')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveFlag = () => {
        handleInputChange('flagUrl', '')
        toast.success('Flag removed')
    }

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error('Country name is required')
            return
        }
        if (!formData.code.trim()) {
            toast.error('Country code is required')
            return
        }
        if (formData.code.length !== 2) {
            toast.error('Country code must be 2 characters (e.g., US, UK)')
            return
        }
        if (!formData.dialCode.trim()) {
            toast.error('Dial code is required')
            return
        }
        if (!formData.currency.trim()) {
            toast.error('Currency code is required')
            return
        }

        if (editingCountry) {
            // Update existing country
            setCountries(countries.map(c =>
                c.id === editingCountry.id
                    ? {...formData, id: c.id, flag: formData.flagUrl ? '' : c.flag, clients: c.clients, dealers: c.dealers}
                    : c
            ))
            toast.success('Country updated successfully!', {
                description: `${formData.name} has been updated.`
            })
        } else {
            // Add new country
            const newCountry = {
                ...formData,
                id: countries.length + 1,
                flag: formData.flagUrl ? '' : '🏳️',
                clients: 0,
                dealers: 0,
            }
            setCountries([...countries, newCountry])
            toast.success('Country added successfully!', {
                description: `${formData.name} has been added to the system.`
            })
        }

        setShowAddDialog(false)
        setEditingCountry(null)
        setFormData({
            name: '',
            code: '',
            dialCode: '',
            currency: '',
            flagUrl: '',
            isActive: true,
        })
    }

    const handleEdit = (country: any) => {
        setEditingCountry(country)
        setFormData({
            name: country.name,
            code: country.code,
            dialCode: country.dialCode,
            currency: country.currency,
            flagUrl: country.flagUrl || '',
            isActive: country.isActive,
        })
        setShowAddDialog(true)
    }

    const handleDelete = (countryName: string, countryId: number) => {
        const country = countries.find(c => c.id === countryId)
        if (country && (country.clients > 0 || country.dealers > 0)) {
            toast.error('Cannot delete country with active clients or dealers', {
                description: `This country has ${country.clients} clients and ${country.dealers} dealers.`
            })
            return
        }

        if (confirm(`Are you sure you want to delete ${countryName}?`)) {
            setCountries(countries.filter(c => c.id !== countryId))
            toast.error(`${countryName} has been deleted`)
        }
    }

    const handleToggleStatus = (countryId: number, currentStatus: boolean) => {
        const country = countries.find(c => c.id === countryId)
        if (country && !currentStatus && (country.clients > 0 || country.dealers > 0)) {
            toast.error('Cannot deactivate country with active clients or dealers')
            return
        }

        setCountries(countries.map(c =>
            c.id === countryId
                ? {...c, isActive: !currentStatus}
                : c
        ))
        toast.success(`Country ${currentStatus ? 'deactivated' : 'activated'}`)
    }

    const handleDialogClose = (open: boolean) => {
        setShowAddDialog(open)
        if (!open) {
            setEditingCountry(null)
            setFormData({
                name: '',
                code: '',
                dialCode: '',
                currency: '',
                flagUrl: '',
                isActive: true,
            })
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Globe className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Countries Management</h1>
                    <p className='text-muted-foreground'>Manage supported countries and regions</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Countries</CardTitle>
                        <Globe className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{countries.length}</div>
                        <p className='text-xs text-muted-foreground'>Configured regions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Active Countries</CardTitle>
                        <Flag className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {countries.filter(c => c.isActive).length}
                        </div>
                        <p className='text-xs text-muted-foreground'>Currently available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {countries.reduce((sum, c) => sum + c.clients, 0)}
                        </div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Dealers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {countries.reduce((sum, c) => sum + c.dealers, 0)}
                        </div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
            </div>

            {/* Countries Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Countries</CardTitle>
                            <CardDescription>
                                Showing {filteredCountries.length} of {countries.length} countries
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search countries...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Dialog open={showAddDialog} onOpenChange={handleDialogClose}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className='mr-2 size-4'/>
                                        Add Country
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='sm:max-w-[500px]'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingCountry ? 'Edit Country' : 'Add New Country'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingCountry
                                                ? 'Update country information and settings'
                                                : 'Add a new country to the system'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4 py-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='flag'>Country Flag</Label>
                                            <div className='flex items-center gap-4'>
                                                {formData.flagUrl ? (
                                                    <div className='relative'>
                                                        <img
                                                            src={formData.flagUrl}
                                                            alt='Flag'
                                                            className='size-16 object-cover rounded border-2 border-border'
                                                        />
                                                        <Button
                                                            variant='destructive'
                                                            size='icon'
                                                            className='absolute -top-2 -right-2 size-6'
                                                            onClick={handleRemoveFlag}
                                                        >
                                                            <X className='size-3'/>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className='size-16 rounded border-2 border-dashed border-border flex items-center justify-center bg-muted'>
                                                        <Flag className='size-6 text-muted-foreground'/>
                                                    </div>
                                                )}
                                                <div className='flex-1'>
                                                    <div className='relative'>
                                                        <input
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={handleFlagUpload}
                                                            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                            id='flag'
                                                        />
                                                        <Button variant='outline' size='sm' className='w-full'>
                                                            <Upload className='mr-2 size-4'/>
                                                            Upload Flag
                                                        </Button>
                                                    </div>
                                                    <p className='text-xs text-muted-foreground mt-1'>
                                                        PNG, JPG up to 1MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='name'>Country Name *</Label>
                                                <Input
                                                    id='name'
                                                    placeholder='United States'
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor='code'>Country Code *</Label>
                                                <Input
                                                    id='code'
                                                    placeholder='US'
                                                    maxLength={2}
                                                    value={formData.code}
                                                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                                />
                                                <p className='text-xs text-muted-foreground'>
                                                    2-letter ISO code
                                                </p>
                                            </div>
                                        </div>

                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='dialCode'>Dial Code *</Label>
                                                <Input
                                                    id='dialCode'
                                                    placeholder='+1'
                                                    value={formData.dialCode}
                                                    onChange={(e) => handleInputChange('dialCode', e.target.value)}
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor='currency'>Currency Code *</Label>
                                                <Input
                                                    id='currency'
                                                    placeholder='USD'
                                                    maxLength={3}
                                                    value={formData.currency}
                                                    onChange={(e) => handleInputChange('currency', e.target.value.toUpperCase())}
                                                />
                                                <p className='text-xs text-muted-foreground'>
                                                    3-letter ISO code
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <div className='space-y-0.5'>
                                                <Label>Active Status</Label>
                                                <p className='text-sm text-muted-foreground'>
                                                    Make this country available for selection
                                                </p>
                                            </div>
                                            <Switch
                                                checked={formData.isActive}
                                                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-2'>
                                        <Button variant='outline' onClick={() => handleDialogClose(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSubmit}>
                                            {editingCountry ? 'Update Country' : 'Add Country'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Flag</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Dial Code</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead className='text-right'>Clients</TableHead>
                                <TableHead className='text-right'>Dealers</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCountries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className='text-center py-8 text-muted-foreground'>
                                        No countries found matching your search
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCountries.map((country) => (
                                    <TableRow key={country.id}>
                                        <TableCell>
                                            {country.flagUrl ? (
                                                <img
                                                    src={country.flagUrl}
                                                    alt={country.name}
                                                    className='size-8 object-cover rounded border'
                                                />
                                            ) : (
                                                <span className='text-2xl'>{country.flag}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className='font-medium'>{country.name}</TableCell>
                                        <TableCell>
                                            <Badge variant='outline'>{country.code}</Badge>
                                        </TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>
                                            {country.dialCode}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant='secondary'>{country.currency}</Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>{country.clients}</TableCell>
                                        <TableCell className='text-right'>{country.dealers}</TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={country.isActive ? 'default' : 'secondary'}>
                                                {country.isActive ? 'Active' : 'Inactive'}
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
                                                    <DropdownMenuItem onClick={() => handleEdit(country)}>
                                                        Edit Country
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(country.id, country.isActive)}
                                                    >
                                                        {country.isActive ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className='text-destructive'
                                                        onClick={() => handleDelete(country.name, country.id)}
                                                    >
                                                        Delete Country
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
