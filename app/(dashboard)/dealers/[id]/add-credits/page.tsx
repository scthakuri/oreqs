'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
import {ArrowLeft, MessageSquare, DollarSign} from 'lucide-react'
import Link from 'next/link'

const Page = ({params}: { params: { id: string } }) => {
    const dealer = {
        name: 'John Smith',
        currentCredits: 15000,
        costPerSms: 0.05,
    }

    const presetAmounts = [1000, 5000, 10000, 25000, 50000]

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href={`/dealers/${params.id}`}>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Add SMS Credits</h1>
                    <p className='text-muted-foreground'>Add SMS credits to {dealer.name}</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Credit Information</CardTitle>
                            <CardDescription>Enter the number of credits to add</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Current Credits</CardTitle>
                                        <MessageSquare className='size-4 text-muted-foreground'/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>{dealer.currentCredits.toLocaleString()}</div>
                                        <p className='text-xs text-muted-foreground'>Available</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Cost Per SMS</CardTitle>
                                        <DollarSign className='size-4 text-muted-foreground'/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>${dealer.costPerSms}</div>
                                        <p className='text-xs text-muted-foreground'>Per message</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator/>

                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='credits'>Number of Credits *</Label>
                                    <Input
                                        id='credits'
                                        type='number'
                                        placeholder='Enter number of credits'
                                        defaultValue='5000'
                                    />
                                </div>

                                <div>
                                    <Label className='mb-3 block'>Quick Select</Label>
                                    <div className='grid grid-cols-3 gap-2 md:grid-cols-5'>
                                        {presetAmounts.map((amount) => (
                                            <Button key={amount} variant='outline' size='sm'>
                                                {amount.toLocaleString()}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div className='space-y-4'>
                                <h3 className='text-lg font-medium'>Cost Calculation</h3>
                                <div className='rounded-lg border p-4 space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-muted-foreground'>Credits to add:</span>
                                        <span className='font-medium'>5,000</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-muted-foreground'>Cost per SMS:</span>
                                        <span className='font-medium'>${dealer.costPerSms}</span>
                                    </div>
                                    <Separator/>
                                    <div className='flex justify-between'>
                                        <span className='font-medium'>Total Cost:</span>
                                        <span className='text-lg font-bold'>$250.00</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-muted-foreground'>New Balance:</span>
                                        <span className='font-medium'>20,000 credits</span>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div className='space-y-2'>
                                <Label htmlFor='notes'>Notes (Optional)</Label>
                                <textarea
                                    id='notes'
                                    className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    placeholder='Add any notes or comments...'
                                />
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
                            <Button className='w-full'>
                                Add Credits
                            </Button>
                            <Link href={`/dealers/${params.id}`}>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• Credits will be added immediately</p>
                                <p>• Transaction will be recorded in history</p>
                                <p>• Dealer will be notified via email</p>
                                <p>• This action cannot be undone</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
