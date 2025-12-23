'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'

const Page = () => {
    const handleSubmit = () => {
        // Simulate API call
        toast.success('Dealer created successfully!')
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/dealers'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Add New Dealer</h1>
                    <p className='text-muted-foreground'>Create a new dealer account</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dealer Information</CardTitle>
                            <CardDescription>Enter the dealer's basic information</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Full Name *</Label>
                                    <Input id='name' placeholder='John Smith'/>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email Address *</Label>
                                    <Input id='email' type='email' placeholder='john.smith@example.com'/>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='phone'>Phone Number *</Label>
                                <Input id='phone' placeholder='+1 234 567 8900'/>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Company Details</h3>
                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='company'>Company Name</Label>
                                        <Input id='company' placeholder='OREQS Partners Inc.'/>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address'>Address</Label>
                                        <Input id='address' placeholder='123 Main Street'/>
                                    </div>
                                    <div className='grid gap-4 md:grid-cols-3'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='city'>City</Label>
                                            <Input id='city' placeholder='New York'/>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='state'>State/Province</Label>
                                            <Input id='state' placeholder='NY'/>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='zip'>ZIP/Postal Code</Label>
                                            <Input id='zip' placeholder='10001'/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className='text-lg font-medium mb-4'>Account Settings</h3>
                                <div className='space-y-2'>
                                    <Label htmlFor='status'>Initial Status *</Label>
                                    <Select defaultValue='active'>
                                        <SelectTrigger id='status'>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='active'>Active</SelectItem>
                                            <SelectItem value='inactive'>Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                Create Dealer
                            </Button>
                            <Link href='/dealers'>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• All fields marked with * are required</p>
                                <p>• Dealer will be assigned to current selected country</p>
                                <p>• Dealer will receive email with login credentials</p>
                                <p>• SMS credits can be added after creation</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
