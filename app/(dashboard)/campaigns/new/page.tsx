'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Badge} from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Calendar} from '@/components/ui/calendar'
import {ArrowLeft, Calendar as CalendarIcon, Sparkles} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {cn} from '@/lib/utils'
import {format} from 'date-fns'

const Page = () => {
    const router = useRouter()
    const [campaignName, setCampaignName] = useState('')
    const [campaignType, setCampaignType] = useState('Scratch Card')
    const [campaignDescription, setCampaignDescription] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [selectedClient, setSelectedClient] = useState('')

    const handleCreateCampaign = () => {
        if (!campaignName || !selectedClient || !startDate || !endDate) {
            toast.error('Please fill in all required fields')
            return
        }

        toast.success('Campaign created successfully!')
        // Redirect to edit page with ID 1 (in real app, use actual created campaign ID)
        router.push('/campaigns/1/edit')
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/campaigns'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                        <Sparkles className='size-6 text-primary'/>
                        <h1 className='text-3xl font-bold tracking-tight'>Create New Campaign</h1>
                    </div>
                    <p className='text-muted-foreground mt-1'>Enter basic information to get started</p>
                </div>
            </div>

            <div className='max-w-3xl'>
                <Card className='border-2'>
                    <CardHeader>
                        <CardTitle>Campaign Information</CardTitle>
                        <CardDescription>
                            Fill in the basic details. You'll be able to add rewards and configure settings after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='name'>Campaign Name *</Label>
                            <Input
                                id='name'
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                placeholder='e.g., Summer Rewards 2024'
                                className='text-lg'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                value={campaignDescription}
                                onChange={(e) => setCampaignDescription(e.target.value)}
                                rows={4}
                                placeholder='Describe your campaign...'
                            />
                        </div>

                        <div className='space-y-3'>
                            <Label>Campaign Type *</Label>
                            <div className='grid gap-3 md:grid-cols-3'>
                                {[
                                    {value: 'Scratch Card', icon: '🎫', label: 'Scratch Card'},
                                    {value: 'Spin Wheel', icon: '🎡', label: 'Spin Wheel'},
                                    {value: 'Slot Machine', icon: '🎰', label: 'Slot Machine'},
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type='button'
                                        onClick={() => setCampaignType(type.value)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                                            campaignType === type.value
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                                        )}
                                    >
                                        <span className='text-3xl'>{type.icon}</span>
                                        <span className='text-sm font-medium'>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='client'>Client *</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger id='client'>
                                    <SelectValue placeholder='Select a client'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='1'>Pizza Palace</SelectItem>
                                    <SelectItem value='2'>Burger King</SelectItem>
                                    <SelectItem value='3'>Starbucks</SelectItem>
                                    <SelectItem value='4'>KFC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label>Start Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !startDate && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 size-4'/>
                                            {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className='space-y-2'>
                                <Label>End Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !endDate && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 size-4'/>
                                            {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 pt-6 border-t'>
                            <Link href='/campaigns' className='flex-1'>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Button onClick={handleCreateCampaign} size='lg' className='flex-1'>
                                <Sparkles className='mr-2 size-4'/>
                                Create & Continue
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className='mt-6 p-4 bg-muted/50 rounded-lg border'>
                    <p className='text-sm text-muted-foreground'>
                        💡 <strong>Next steps:</strong> After creating your campaign, you'll be able to add rewards, configure registration forms, and customize advanced settings.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
