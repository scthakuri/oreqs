'use client'

import {useCallback, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {DatePicker} from '@/components/ui/date-picker'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Loader2, Check, ChevronsUpDown} from 'lucide-react'
import {toast} from 'sonner'
import {dealersApi} from '@/lib/api/dealers'
import {countriesApi} from '@/lib/api/countries'
import {dealerSchema, type DealerFormData} from '@/lib/validation/dealer.schema'
import {setBackendErrors} from '@/lib/error-handler'
import type {ApiError} from '@/types/errors'
import type {DealerCreateData, Dealer} from '@/types/api'
import {useRouter} from 'next/navigation'
import {format} from 'date-fns'
import {cn} from '@/lib/utils'

interface DealerFormProps {
    dealer?: Dealer
    mode: 'create' | 'edit'
}

export function DealerForm({dealer, mode}: DealerFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [countryOpen, setCountryOpen] = useState(false)

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        watch,
        setError,
        control,
    } = useForm<DealerFormData>({
        resolver: zodResolver(dealerSchema),
        defaultValues: dealer ? {
            first_name: dealer.user.first_name,
            middle_name: dealer.user.middle_name,
            last_name: dealer.user.last_name,
            email: dealer.user.email,
            phone: dealer.user.phone,
            password: '',
            company_name: dealer.company_data?.name || '',
            registration_number: dealer.company_data?.registration_number || '',
            tax_id: dealer.company_data?.tax_id || '',
            company_address: dealer.company_data?.address || '',
            company_city: dealer.company_data?.city || '',
            company_state: dealer.company_data?.state || '',
            company_postal_code: dealer.company_data?.postal_code || '',
            country_id: dealer.country,
            subscription_plan: dealer.subscription_plan,
            subscription_start: dealer.subscription_start ? new Date(dealer.subscription_start) : undefined,
            subscription_end: dealer.subscription_end ? new Date(dealer.subscription_end) : undefined,
            clients_limit: 0,
        } : {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            company_name: '',
            registration_number: '',
            tax_id: '',
            company_address: '',
            company_city: '',
            company_state: '',
            company_postal_code: '',
            country_id: 0,
            subscription_plan: 'demo',
            subscription_start: new Date(),
            subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            clients_limit: 0,
        },
    })

    const selectedSubscriptionPlan = watch('subscription_plan')

    const {data: countriesData} = useQuery({
        queryKey: ['countries', 'active'],
        queryFn: () => countriesApi.list({is_active: true, ordering: 'name'}),
    })

    const countries = countriesData?.results || []

    const createMutation = useMutation({
        mutationFn: (data: DealerCreateData) => dealersApi.create(data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['dealers']})
            toast.success('Dealer created successfully!', {
                description: `${data.user.full_name} has been added to the system.`
            })
            router.push('/admin/dealers')
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = useCallback(async (data: DealerFormData) => {
        const dealerData: DealerCreateData = {
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            company_name: data.company_name,
            registration_number: data.registration_number,
            tax_id: data.tax_id,
            company_address: data.company_address,
            company_city: data.company_city,
            company_state: data.company_state,
            company_postal_code: data.company_postal_code,
            country_id: data.country_id,
            subscription_plan: data.subscription_plan,
            subscription_start: data.subscription_start ? format(data.subscription_start, 'yyyy-MM-dd') : undefined,
            subscription_end: data.subscription_end ? format(data.subscription_end, 'yyyy-MM-dd') : null,
            clients_limit: data.clients_limit,
        }
        createMutation.mutate(dealerData)
    }, [createMutation])

    return (
        <form onSubmit={handleFormSubmit(onSubmit)}>
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Enter the dealer&#39;s personal details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-3'>
                                <div className='space-y-2'>
                                    <Label htmlFor='first_name'>First Name *</Label>
                                    <Input id='first_name' placeholder='John' {...register('first_name')} />
                                    {formErrors.first_name && (
                                        <p className='text-sm text-destructive'>{formErrors.first_name.message}</p>
                                    )}
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='middle_name'>Middle Name</Label>
                                    <Input id='middle_name' placeholder='M.' {...register('middle_name')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='last_name'>Last Name *</Label>
                                    <Input id='last_name' placeholder='Smith' {...register('last_name')} />
                                    {formErrors.last_name && (
                                        <p className='text-sm text-destructive'>{formErrors.last_name.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email Address *</Label>
                                    <Input id='email' type='email' placeholder='john.smith@example.com' {...register('email')} disabled={mode === 'edit'} />
                                    {formErrors.email && (
                                        <p className='text-sm text-destructive'>{formErrors.email.message}</p>
                                    )}
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='phone'>Phone Number</Label>
                                    <Input id='phone' placeholder='+1 234 567 8900' {...register('phone')} />
                                    {formErrors.phone && (
                                        <p className='text-sm text-destructive'>{formErrors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {mode === 'create' && (
                                <div className='space-y-2'>
                                    <Label htmlFor='password'>Password *</Label>
                                    <Input id='password' type='password' placeholder='Enter password (min 8 characters)' {...register('password')} />
                                    {formErrors.password && (
                                        <p className='text-sm text-destructive'>{formErrors.password.message}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Enter the company details for this dealer</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='space-y-2'>
                                <Label htmlFor='company_name'>Company Name *</Label>
                                <Input id='company_name' placeholder='ABC Corporation' {...register('company_name')} />
                                {formErrors.company_name && (
                                    <p className='text-sm text-destructive'>{formErrors.company_name.message}</p>
                                )}
                            </div>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='registration_number'>Registration Number</Label>
                                    <Input id='registration_number' placeholder='REG-12345' {...register('registration_number')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='tax_id'>Tax ID</Label>
                                    <Input id='tax_id' placeholder='TAX-98765' {...register('tax_id')} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='company_address'>Address</Label>
                                <Input id='company_address' placeholder='123 Business Street' {...register('company_address')} />
                            </div>

                            <div className='grid gap-4 md:grid-cols-3'>
                                <div className='space-y-2'>
                                    <Label htmlFor='company_city'>City</Label>
                                    <Input id='company_city' placeholder='New York' {...register('company_city')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='company_state'>State/Province</Label>
                                    <Input id='company_state' placeholder='NY' {...register('company_state')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='company_postal_code'>Postal Code</Label>
                                    <Input id='company_postal_code' placeholder='10001' {...register('company_postal_code')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment & Subscription</CardTitle>
                            <CardDescription>Configure dealer assignment and subscription details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='space-y-2'>
                                <Label htmlFor='country_id'>Country *</Label>
                                <Controller
                                    name='country_id'
                                    control={control}
                                    render={({field}) => (
                                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' role='combobox' aria-expanded={countryOpen} className='w-full justify-between' disabled={mode === 'edit'}>
                                                    {field.value ? countries.find((country) => country.id === field.value)?.name : 'Select country...'}
                                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-full p-0'>
                                                <Command>
                                                    <CommandInput placeholder='Search country...' />
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup className='max-h-64 overflow-auto'>
                                                        {countries.map((country) => (
                                                            <CommandItem key={country.id} value={country.name} onSelect={() => {
                                                                field.onChange(country.id)
                                                                setCountryOpen(false)
                                                            }}>
                                                                <Check className={cn('mr-2 h-4 w-4', field.value === country.id ? 'opacity-100' : 'opacity-0')} />
                                                                {country.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {formErrors.country_id && (
                                    <p className='text-sm text-destructive'>{formErrors.country_id.message}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='subscription_plan'>Subscription Plan *</Label>
                                <Controller
                                    name='subscription_plan'
                                    control={control}
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select plan' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='demo'>Demo</SelectItem>
                                                <SelectItem value='premium'>Premium</SelectItem>
                                                <SelectItem value='lifetime'>Lifetime</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {selectedSubscriptionPlan !== 'lifetime' && (
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='subscription_start'>Subscription Start *</Label>
                                        <Controller
                                            name='subscription_start'
                                            control={control}
                                            render={({field}) => (
                                                <DatePicker date={field.value} onDateChange={field.onChange} placeholder='Select start date' />
                                            )}
                                        />
                                        {formErrors.subscription_start && (
                                            <p className='text-sm text-destructive'>{formErrors.subscription_start.message}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='subscription_end'>Subscription End *</Label>
                                        <Controller
                                            name='subscription_end'
                                            control={control}
                                            render={({field}) => (
                                                <DatePicker date={field.value ?? undefined} onDateChange={field.onChange} placeholder='Select end date' />
                                            )}
                                        />
                                        {formErrors.subscription_end && (
                                            <p className='text-sm text-destructive'>{formErrors.subscription_end.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedSubscriptionPlan === 'lifetime' && (
                                <div className='rounded-lg border bg-muted/50 p-4'>
                                    <p className='text-sm font-medium'>Lifetime Plan Selected</p>
                                    <p className='text-xs text-muted-foreground mt-1'>This dealer will have unlimited access with no expiration date.</p>
                                </div>
                            )}

                            <div className='space-y-2'>
                                <Label htmlFor='clients_limit'>Clients Limit *</Label>
                                <Input id='clients_limit' type='number' min='0' placeholder='Enter clients limit (0 for unlimited)' {...register('clients_limit', {valueAsNumber: true})} />
                                {formErrors.clients_limit && (
                                    <p className='text-sm text-destructive'>{formErrors.clients_limit.message}</p>
                                )}
                                <p className='text-xs text-muted-foreground'>Maximum number of clients this dealer can add. Set to 0 for unlimited.</p>
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
                            <Button type='submit' className='w-full' disabled={createMutation.isPending}>
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className='mr-2 size-4 animate-spin'/>
                                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : (
                                    mode === 'create' ? 'Create Dealer' : 'Update Dealer'
                                )}
                            </Button>
                            <Button variant='outline' className='w-full' type='button' onClick={() => router.push('/admin/dealers')}>
                                Cancel
                            </Button>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>All fields marked with * are required</p>
                                <p>Company will be created automatically</p>
                                <p>Country admin will be auto-assigned</p>
                                {mode === 'create' && <p>Dealer will receive email with login credentials</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
