'use client'

import {useCallback} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {DatePicker} from '@/components/ui/date-picker'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Loader2} from 'lucide-react'
import {toast} from 'sonner'
import {clientsApi} from '@/lib/api/clients'
import {clientSchema, type ClientFormData} from '@/lib/validation/client.schema'
import {setBackendErrors} from '@/lib/error-handler'
import type {ApiError} from '@/types/errors'
import type {ClientCreateData, ClientUpdateData, Client} from '@/types/api'
import {useRouter} from 'next/navigation'
import {format} from 'date-fns'
import {SearchableSelect} from "@/components/ui/SearchableSelect";
import {Switch} from "@/components/ui/switch";

interface ClientFormProps {
    client?: Client
    mode: 'create' | 'edit'
}

export function ClientForm({client, mode}: ClientFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        watch,
        setError,
        control,
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: client ? {
            first_name: client.user.first_name,
            middle_name: client.user.middle_name,
            last_name: client.user.last_name,
            email: client.user.email,
            phone: client.user.phone,
            password: '',
            company_name: client.company_data?.name || '',
            registration_number: client.company_data?.registration_number || '',
            tax_id: client.company_data?.tax_id || '',
            company_address: client.company_data?.address || '',
            company_city: client.company_data?.city || '',
            company_state: client.company_data?.state || '',
            company_postal_code: client.company_data?.postal_code || '',
            dealer_id: client.dealer,
            country_id: client.country,
            subscription_plan: client.subscription_plan,
            subscription_start: client.subscription_start ? new Date(client.subscription_start) : undefined,
            subscription_end: client.subscription_end ? new Date(client.subscription_end) : undefined,
            branch_limit: 0,
            campaign_limit: 0,
            enable_campaign: client.enable_campaign,
            enable_sms_marketing: client.enable_sms_marketing,
            enable_email_marketing: client.enable_email_marketing,
            use_own_sms_gateway: client.use_own_sms_gateway,
            use_own_email_service: client.use_own_email_service,
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
            dealer_id: 0,
            country_id: 0,
            subscription_plan: 'demo',
            subscription_start: new Date(),
            subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            branch_limit: 0,
            campaign_limit: 0,
            enable_campaign: true,
            enable_sms_marketing: false,
            enable_email_marketing: false,
            use_own_sms_gateway: false,
            use_own_email_service: false,
        },
    })

    const selectedCountryId = watch('country_id')
    const selectedSubscriptionPlan = watch('subscription_plan')
    const enableCampaign = watch('enable_campaign')
    const enableSmsMarketing = watch('enable_sms_marketing')
    const enableEmailMarketing = watch('enable_email_marketing')

    const createMutation = useMutation({
        mutationFn: async (data: ClientCreateData) => {
            return await clientsApi.create(data)
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['clients']})
            toast.success('Client created successfully!', {
                description: `${data.user.full_name} has been added to the system.`
            })
            router.push('/admin/clients')
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<ClientUpdateData>) => {
            if (!client?.id) throw new Error('Client ID is required for update')
            return await clientsApi.update(client.id, data)
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['clients']})
            toast.success('Client updated successfully!', {
                description: `${data.user.full_name} has been updated.`
            })
            router.push('/admin/clients')
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = useCallback(async (data: ClientFormData) => {
        if (mode === 'create') {
            const clientData: ClientCreateData = {
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
                dealer_id: data.dealer_id,
                subscription_plan: data.subscription_plan,
                subscription_start: data.subscription_start ? format(data.subscription_start, 'yyyy-MM-dd') : undefined,
                subscription_end: data.subscription_end ? format(data.subscription_end, 'yyyy-MM-dd') : null,
                branch_limit: data.branch_limit,
                campaign_limit: data.campaign_limit,
                enable_campaign: data.enable_campaign,
                enable_sms_marketing: data.enable_sms_marketing,
                enable_email_marketing: data.enable_email_marketing,
                use_own_sms_gateway: data.use_own_sms_gateway,
                use_own_email_service: data.use_own_email_service,
            }
            createMutation.mutate(clientData)
        } else {
            const updateData: Partial<ClientUpdateData> = {
                subscription_plan: data.subscription_plan,
                subscription_start: data.subscription_start ? format(data.subscription_start, 'yyyy-MM-dd') : undefined,
                subscription_end: data.subscription_end ? format(data.subscription_end, 'yyyy-MM-dd') : null,
                enable_campaign: data.enable_campaign,
                enable_sms_marketing: data.enable_sms_marketing,
                enable_email_marketing: data.enable_email_marketing,
                use_own_sms_gateway: data.use_own_sms_gateway,
                use_own_email_service: data.use_own_email_service,
            }
            updateMutation.mutate(updateData)
        }
    }, [mode, createMutation, updateMutation])

    return (
        <form onSubmit={handleFormSubmit(onSubmit)}>
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Enter the client&#39;s personal details</CardDescription>
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
                                    <Input id='email' type='email'
                                           placeholder='john.smith@example.com' {...register('email')}
                                           disabled={mode === 'edit'}/>
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
                                    <Input id='password' type='password'
                                           placeholder='Enter password (min 8 characters)' {...register('password')} />
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
                            <CardDescription>Enter the company details for this client</CardDescription>
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
                                    <Input id='registration_number'
                                           placeholder='REG-12345' {...register('registration_number')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='tax_id'>Tax ID</Label>
                                    <Input id='tax_id' placeholder='TAX-98765' {...register('tax_id')} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='company_address'>Address</Label>
                                <Input id='company_address'
                                       placeholder='123 Business Street' {...register('company_address')} />
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
                                    <Input id='company_postal_code'
                                           placeholder='10001' {...register('company_postal_code')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment & Subscription</CardTitle>
                            <CardDescription>Configure client assignment and subscription details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='country_id'>Country *</Label>

                                    <SearchableSelect
                                        name='country_id'
                                        control={control}
                                        fetchUrl="/countries/"
                                        queryKey={['countries']}
                                        valueKey="id"
                                        labelKey="name"
                                        placeholder="Select country..."
                                        searchPlaceholder="Search country..."
                                        disabled={mode === 'edit'}
                                        queryParams={{
                                            is_active: true,
                                            ordering: 'name'
                                        }}
                                    />

                                    {formErrors.country_id && (
                                        <p className='text-sm text-destructive'>{formErrors.country_id.message}</p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='dealer_id'>Dealer *</Label>

                                    <SearchableSelect
                                        name='dealer_id'
                                        control={control}
                                        fetchUrl="/dealers/"
                                        queryKey={['dealers']}
                                        valueKey="id"
                                        labelKey="company_data.name"
                                        placeholder="Select dealer..."
                                        searchPlaceholder="Search dealer..."
                                        disabled={mode === 'edit' || !selectedCountryId}
                                        emptyText="No dealer found."
                                        queryParams={{
                                            country: selectedCountryId,
                                            is_active: true,
                                            ordering: 'user__first_name'
                                        }}
                                    />
                                    {formErrors.dealer_id && (
                                        <p className='text-sm text-destructive'>{formErrors.dealer_id.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='subscription_plan'>Subscription Plan *</Label>
                                <Controller
                                    name='subscription_plan'
                                    control={control}
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select plan'/>
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
                                                <DatePicker date={field.value} onDateChange={field.onChange}
                                                            placeholder='Select start date'/>
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
                                                <DatePicker date={field.value ?? undefined}
                                                            onDateChange={field.onChange}
                                                            placeholder='Select end date'/>
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
                                    <p className='text-xs text-muted-foreground mt-1'>This client will have unlimited
                                        access with no expiration date.</p>
                                </div>
                            )}

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='branch_limit'>Branch Limit *</Label>
                                    <Input id='branch_limit' type='number' min='0'
                                           placeholder='Enter branch limit (0 for unlimited)' {...register('branch_limit', {valueAsNumber: true})} />
                                    {formErrors.branch_limit && (
                                        <p className='text-sm text-destructive'>{formErrors.branch_limit.message}</p>
                                    )}
                                    <p className='text-xs text-muted-foreground'>Maximum branches. Set to 0 for
                                        unlimited.</p>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='campaign_limit'>Campaign Limit *</Label>
                                    <Input id='campaign_limit' type='number' min='0'
                                           placeholder='Enter campaign limit (0 for unlimited)' {...register('campaign_limit', {valueAsNumber: true})} />
                                    {formErrors.campaign_limit && (
                                        <p className='text-sm text-destructive'>{formErrors.campaign_limit.message}</p>
                                    )}
                                    <p className='text-xs text-muted-foreground'>Maximum campaigns. Set to 0 for
                                        unlimited.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Features & Settings</CardTitle>
                            <CardDescription>Configure available features and marketing settings</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <Label htmlFor='enable_campaign'>Enable Campaigns</Label>
                                        <p className='text-sm text-muted-foreground'>
                                            Allow this client to create and manage campaigns
                                        </p>
                                    </div>
                                    <Controller
                                        name='enable_campaign'
                                        control={control}
                                        render={({field}) => (
                                            <Switch
                                                id='enable_campaign'
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>

                                <div className='flex items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <Label htmlFor='enable_sms_marketing'>Enable SMS Marketing</Label>
                                        <p className='text-sm text-muted-foreground'>
                                            Allow SMS marketing campaigns for this client
                                        </p>
                                    </div>
                                    <Controller
                                        name='enable_sms_marketing'
                                        control={control}
                                        render={({field}) => (
                                            <Switch
                                                id='enable_sms_marketing'
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>

                                {enableSmsMarketing && (
                                    <div className='ml-6 flex items-center justify-between rounded-lg border p-4 bg-muted/50'>
                                        <div className='space-y-0.5'>
                                            <Label htmlFor='use_own_sms_gateway'>Use Own SMS Gateway</Label>
                                            <p className='text-sm text-muted-foreground'>
                                                Client will use their own SMS gateway service
                                            </p>
                                        </div>
                                        <Controller
                                            name='use_own_sms_gateway'
                                            control={control}
                                            render={({field}) => (
                                                <Switch
                                                    id='use_own_sms_gateway'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                <div className='flex items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <Label htmlFor='enable_email_marketing'>Enable Email Marketing</Label>
                                        <p className='text-sm text-muted-foreground'>
                                            Allow email marketing campaigns for this client
                                        </p>
                                    </div>
                                    <Controller
                                        name='enable_email_marketing'
                                        control={control}
                                        render={({field}) => (
                                            <Switch
                                                id='enable_email_marketing'
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>

                                {enableEmailMarketing && (
                                    <div className='ml-6 flex items-center justify-between rounded-lg border p-4 bg-muted/50'>
                                        <div className='space-y-0.5'>
                                            <Label htmlFor='use_own_email_service'>Use Own Email Service</Label>
                                            <p className='text-sm text-muted-foreground'>
                                                Client will use their own email service provider
                                            </p>
                                        </div>
                                        <Controller
                                            name='use_own_email_service'
                                            control={control}
                                            render={({field}) => (
                                                <Switch
                                                    id='use_own_email_service'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                )}
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
                            <Button
                                type='submit'
                                className='w-full'
                                disabled={mode === 'create' ? createMutation.isPending : updateMutation.isPending}
                            >
                                {(mode === 'create' ? createMutation.isPending : updateMutation.isPending) ? (
                                    <>
                                        <Loader2 className='mr-2 size-4 animate-spin'/>
                                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : (
                                    mode === 'create' ? 'Create Client' : 'Update Client'
                                )}
                            </Button>
                            <Button variant='outline' className='w-full' type='button'
                                    onClick={() => router.push('/admin/clients')}>
                                Cancel
                            </Button>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>All fields marked with * are required</p>
                                <p>Company will be created automatically</p>
                                <p>Select country first to load dealers</p>
                                {mode === 'create' && <p>Client will receive email with login credentials</p>}
                                <p>Lifetime plan has no expiration date</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}