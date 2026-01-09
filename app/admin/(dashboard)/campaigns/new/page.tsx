'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {format} from 'date-fns'
import {CalendarIcon, ArrowLeft, Sparkles} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {SearchableSelect} from '@/components/ui/SearchableSelect'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Calendar} from '@/components/ui/calendar'

import {campaignsApi, type CampaignCreateData} from '@/lib/api/campaigns'
import {setBackendErrors} from '@/lib/error-handler'
import {ApiError} from '@/types/errors'
import {cn} from '@/lib/utils'

const campaignSchema = z.object({
    name: z.string().min(1, 'Campaign name is required').max(200, 'Name is too long'),
    description: z.string().optional(),
    campaign_type: z.enum(['scratch_card', 'spin_wheel', 'lucky_draw', 'instant_win'], {
        message: 'Campaign type is required',
    }),
    start_date: z.date({message: 'Start date is required'}),
    end_date: z.date({message: 'End date is required'}),
    client: z.number({message: 'Client is required'}).min(1, 'Client is required'),
}).refine(data => data.end_date > data.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
})

type CampaignFormData = z.infer<typeof campaignSchema>

const campaignTypeOptions = [
    {value: 'scratch_card', label: 'Scratch Card', icon: '🎫'},
    {value: 'spin_wheel', label: 'Spin Wheel', icon: '🎡'},
    {value: 'instant_win', label: 'Instant Win', icon: '🎰'},
]

export default function CreateCampaignPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors, isSubmitting},
        setValue,
        watch,
        setError,
        control,
    } = useForm<CampaignFormData>({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
            description: '',
        },
    })

    const startDate = watch('start_date')
    const endDate = watch('end_date')
    const campaignType = watch('campaign_type')

    const createMutation = useMutation({
        mutationFn: async (data: CampaignFormData) => {
            const createData: CampaignCreateData = {
                name: data.name,
                description: data.description,
                campaign_type: data.campaign_type,
                status: 'draft',
                start_date: data.start_date.toISOString(),
                end_date: data.end_date.toISOString(),
                client: data.client,
            }
            return await campaignsApi.create(createData)
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['campaigns']})
            await queryClient.refetchQueries({queryKey: ['campaigns']})
            toast.success('Campaign created successfully', {
                description: `${data.name} has been created.`
            })
            router.push(`/admin/campaigns/${data.id}/edit`)
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
            toast.error('Failed to create campaign')
        },
    })

    const onSubmit = (data: CampaignFormData) => {
        createMutation.mutate(data)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/campaigns'>
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

            <Card className='border-2'>
                <CardHeader>
                    <CardTitle>Campaign Information</CardTitle>
                    <CardDescription>
                        Fill in the basic details. You&#39;ll be able to add rewards and configure settings after creation.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <form onSubmit={handleFormSubmit(onSubmit)} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='name'>Campaign Name *</Label>
                            <Input
                                id='name'
                                {...register('name')}
                                placeholder='e.g., Summer Rewards 2024'
                                className='text-lg'
                            />
                            {errors.name && (
                                <p className='text-sm text-destructive'>{errors.name.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                {...register('description')}
                                rows={4}
                                placeholder='Describe your campaign...'
                            />
                            {errors.description && (
                                <p className='text-sm text-destructive'>{errors.description.message}</p>
                            )}
                        </div>

                        <div className='space-y-3'>
                            <Label>Campaign Type *</Label>
                            <div className='grid gap-3 md:grid-cols-3'>
                                {campaignTypeOptions.map((type) => (
                                    <button
                                        key={type.value}
                                        type='button'
                                        onClick={() => setValue('campaign_type', type.value as "scratch_card" | "spin_wheel" | "lucky_draw" | "instant_win", {
                                            shouldDirty: true,
                                            shouldValidate: true
                                        })}
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
                            {errors.campaign_type && (
                                <p className='text-sm text-destructive'>{errors.campaign_type.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='client'>Client *</Label>
                            <SearchableSelect
                                name='client'
                                control={control}
                                fetchUrl="/clients/"
                                queryKey={['clients']}
                                valueKey="id"
                                labelKey="company_data.name"
                                placeholder="Select clients..."
                                searchPlaceholder="Search clients..."
                                emptyText="No clients found."
                            />

                            {errors.client && (
                                <p className='text-sm text-destructive'>{errors.client.message}</p>
                            )}
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
                                            onSelect={(date) => date && setValue('start_date', date, {
                                                shouldDirty: true,
                                                shouldValidate: true
                                            })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.start_date && (
                                    <p className='text-sm text-destructive'>{errors.start_date.message}</p>
                                )}
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
                                            onSelect={(date) => date && setValue('end_date', date, {
                                                shouldDirty: true,
                                                shouldValidate: true
                                            })}
                                            initialFocus
                                            disabled={(date) => startDate ? date < startDate : false}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.end_date && (
                                    <p className='text-sm text-destructive'>{errors.end_date.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='flex items-center gap-3 pt-6 border-t'>
                            <Link href='/admin/campaigns' className='flex-1'>
                                <Button variant='outline' className='w-full'>
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type='submit'
                                size='lg'
                                className='flex-1'
                                disabled={isSubmitting || createMutation.isPending}
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Sparkles className='mr-2 size-4 animate-spin'/>
                                        Creating Campaign...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='mr-2 size-4'/>
                                        Create & Continue
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className='p-4 bg-muted/50 rounded-lg border'>
                <p className='text-sm text-muted-foreground'>
                    💡 <strong>Next steps:</strong> After creating your campaign, you&#39;ll be able to add rewards,
                    configure registration forms, and customize advanced settings.
                </p>
            </div>
        </div>
    )
}
