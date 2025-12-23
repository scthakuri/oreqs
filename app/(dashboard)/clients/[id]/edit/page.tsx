'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {Checkbox} from '@/components/ui/checkbox'
import {Switch} from '@/components/ui/switch'
import {ArrowLeft, Save} from 'lucide-react'
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
import {toast} from 'sonner'

const Page = () => {
    const params = useParams()
    const router = useRouter()

    // Mock existing data - would come from API
    const [formData, setFormData] = useState({
        businessName: 'Pizza Palace',
        email: 'contact@pizzapalace.com',
        phone: '+1 234 567 8900',
        dealer: '1',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        plan: 'premium',
        branchLimit: '15',
        smsMode: 'platform',
        isActive: true,
        enableAnalytics: true,
        allowBranchCreation: true,
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const handleSubmit = () => {
        // Validation
        if (!formData.businessName.trim()) {
            toast.error('Business name is required')
            return
        }
        if (!formData.email.trim()) {
            toast.error('Email address is required')
            return
        }
        if (!formData.phone.trim()) {
            toast.error('Phone number is required')
            return
        }
        if (!formData.dealer) {
            toast.error('Please select a dealer')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        // Simulate API call
        toast.success('Client updated successfully!', {
            description: `${formData.businessName} has been updated.`
        })

        // Navigate back after a short delay
        setTimeout(() => {
            router.push(`/clients/${params.id}`)
        }, 1500)
    }

    const handleCancel = () => {
        router.push(`/clients/${params.id}`)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href={`/clients/${params.id}`}>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Client</h1>
                    <p className='text-muted-foreground'>Update client information and settings</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Information</CardTitle>
                            <CardDescription>Update the client's business information</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='businessName'>Business Name *</Label>
                                    <Input
                                        id='businessName'
                                        placeholder='Pizza Palace'
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email Address *</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        placeholder='contact@pizzapalace.com'
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='phone'>Phone Number *</Label>
                                    <Input
                                        id='phone'
                                        placeholder='+1 234 567 8900'
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='dealer'>Dealer *</Label>
                                    <Select value={formData.dealer} onValueChange={(value) => handleInputChange('dealer', value)}>
                                        <SelectTrigger id='dealer'>
                                            <SelectValue placeholder='Select dealer'/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='1'>John Smith (US)</SelectItem>
                                            <SelectItem value='2'>Emma Wilson (UK)</SelectItem>
                                            <SelectItem value='3'>Rajesh Kumar (NP)</SelectItem>
                                            <SelectItem value='4'>Sarah Johnson (AU)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Business Address</h3>
                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address'>Street Address</Label>
                                        <Input
                                            id='address'
                                            placeholder='123 Main Street'
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                        />
                                    </div>
                                    <div className='grid gap-4 md:grid-cols-3'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='city'>City</Label>
                                            <Input
                                                id='city'
                                                placeholder='New York'
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='state'>State/Province</Label>
                                            <Input
                                                id='state'
                                                placeholder='NY'
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='zip'>ZIP Code</Label>
                                            <Input
                                                id='zip'
                                                placeholder='10001'
                                                value={formData.zip}
                                                onChange={(e) => handleInputChange('zip', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='country'>Country</Label>
                                        <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                                            <SelectTrigger id='country'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='US'>United States</SelectItem>
                                                <SelectItem value='UK'>United Kingdom</SelectItem>
                                                <SelectItem value='AU'>Australia</SelectItem>
                                                <SelectItem value='NP'>Nepal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Subscription Plan</h3>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='plan'>Plan Type *</Label>
                                        <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                                            <SelectTrigger id='plan'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='trial'>Trial (Free - 14 days)</SelectItem>
                                                <SelectItem value='standard'>Standard ($99/month)</SelectItem>
                                                <SelectItem value='premium'>Premium ($199/month)</SelectItem>
                                                <SelectItem value='enterprise'>Enterprise ($299/month)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='branchLimit'>Branch Limit</Label>
                                        <Input
                                            id='branchLimit'
                                            type='number'
                                            placeholder='10'
                                            value={formData.branchLimit}
                                            onChange={(e) => handleInputChange('branchLimit', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>SMS Settings</h3>
                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='smsMode'>SMS Mode *</Label>
                                        <Select value={formData.smsMode} onValueChange={(value) => handleInputChange('smsMode', value)}>
                                            <SelectTrigger id='smsMode'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='platform'>Platform SMS (Use dealer credits)</SelectItem>
                                                <SelectItem value='own'>Own SMS Provider</SelectItem>
                                                <SelectItem value='none'>No SMS</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Account Status</h3>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='space-y-0.5'>
                                            <Label>Active Status</Label>
                                            <p className='text-sm text-muted-foreground'>
                                                Enable or disable this client account
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Features & Permissions</h3>
                                <div className='space-y-3'>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='analytics'
                                            checked={formData.enableAnalytics}
                                            onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked as boolean)}
                                        />
                                        <label htmlFor='analytics'
                                               className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            Enable Analytics Dashboard
                                        </label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='branchCreation'
                                            checked={formData.allowBranchCreation}
                                            onCheckedChange={(checked) => handleInputChange('allowBranchCreation', checked as boolean)}
                                        />
                                        <label htmlFor='branchCreation'
                                               className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            Allow Branch Creation
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='lg:col-span-1'>
                    <Card className='sticky top-4'>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Button className='w-full' onClick={handleSubmit}>
                                <Save className='mr-2 size-4'/>
                                Save Changes
                            </Button>
                            <Button variant='outline' className='w-full' onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• All fields marked with * are required</p>
                                <p>• Changes take effect immediately</p>
                                <p>• Email changes require verification</p>
                                <p>• Deactivating suspends all campaigns</p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium mb-2'>Danger Zone</p>
                                <Button
                                    variant='destructive'
                                    className='w-full'
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                                            toast.error('Client deleted successfully')
                                            setTimeout(() => router.push('/clients'), 1500)
                                        }
                                    }}
                                >
                                    Delete Client
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
