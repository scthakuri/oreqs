'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {Checkbox} from '@/components/ui/checkbox'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'

const Page = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        dealer: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        plan: 'standard',
        branchLimit: '5',
        smsMode: 'platform',
        enableDemo: true,
        sendEmail: true,
        enableAnalytics: true,
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
        toast.success('Client created successfully!', {
            description: `${formData.businessName} has been added to the system.`
        })

        // Navigate back after a short delay
        setTimeout(() => {
            router.push('/clients')
        }, 1500)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/clients'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Add New Client</h1>
                    <p className='text-muted-foreground'>Create a new client account</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Information</CardTitle>
                            <CardDescription>Enter the client's business information</CardDescription>
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
                                <h3 className='text-lg font-medium mb-4'>Features</h3>
                                <div className='space-y-3'>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='demo'
                                            checked={formData.enableDemo}
                                            onCheckedChange={(checked) => handleInputChange('enableDemo', checked as boolean)}
                                        />
                                        <label htmlFor='demo'
                                               className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            Enable Demo Mode (14 days)
                                        </label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='sendEmail'
                                            checked={formData.sendEmail}
                                            onCheckedChange={(checked) => handleInputChange('sendEmail', checked as boolean)}
                                        />
                                        <label htmlFor='sendEmail'
                                               className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            Send Welcome Email
                                        </label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='analytics'
                                            checked={formData.enableAnalytics}
                                            onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked as boolean)}
                                        />
                                        <label htmlFor='analytics'
                                               className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            Enable Analytics
                                        </label>
                                    </div>
                                </div>
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
                            <Button className='w-full' onClick={handleSubmit}>
                                Create Client
                            </Button>
                            <Link href='/clients'>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• All fields marked with * are required</p>
                                <p>• Client will receive welcome email with login details</p>
                                <p>• Demo mode expires in 14 days</p>
                                <p>• Branches can be added after creation</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
