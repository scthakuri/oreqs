'use client'

import {useCallback} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {Loader2} from 'lucide-react'
import {toast} from 'sonner'
import {branchesApi} from '@/lib/api/branches'
import {branchSchema, type BranchFormData} from '@/lib/validation/branch.schema'
import {setBackendErrors} from '@/lib/error-handler'
import type {ApiError} from '@/types/errors'
import type {BranchCreateData} from '@/types/api'

interface BranchFormProps {
    clientId: number
    onSuccess?: () => void
}

export function BranchForm({clientId, onSuccess}: BranchFormProps) {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        setError,
    } = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            client_id: clientId,
            branch_name: '',
            branch_code: '',
            address: '',
            city: '',
        },
    })

    const createMutation = useMutation({
        mutationFn: async (data: BranchCreateData) => {
            return await branchesApi.create(data)
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['branches']})
            await queryClient.invalidateQueries({queryKey: ['client', clientId]})
            toast.success('Branch created successfully!', {
                description: `${data.user.full_name} - ${data.branch_name} has been added.`
            })
            onSuccess?.()
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = useCallback(async (data: BranchFormData) => {
        const branchData: BranchCreateData = {
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            client_id: clientId,
            branch_name: data.branch_name,
            branch_code: data.branch_code,
            address: data.address,
            city: data.city,
        }
        createMutation.mutate(branchData)
    }, [createMutation, clientId])

    return (
        <form onSubmit={handleFormSubmit(onSubmit)} className='flex flex-col h-full'>
            <div className='flex-1 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Enter the branch manager&#39;s personal details</CardDescription>
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
                                <Input id='email' type='email' placeholder='john.smith@example.com' {...register('email')} />
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

                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password *</Label>
                            <Input id='password' type='password' placeholder='Enter password (min 8 characters)' {...register('password')} />
                            {formErrors.password && (
                                <p className='text-sm text-destructive'>{formErrors.password.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branch Information</CardTitle>
                        <CardDescription>Enter the branch details</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='branch_name'>Branch Name *</Label>
                                <Input id='branch_name' placeholder='Downtown Branch' {...register('branch_name')} />
                                {formErrors.branch_name && (
                                    <p className='text-sm text-destructive'>{formErrors.branch_name.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='branch_code'>Branch Code *</Label>
                                <Input id='branch_code' placeholder='DT-001' {...register('branch_code')} />
                                {formErrors.branch_code && (
                                    <p className='text-sm text-destructive'>{formErrors.branch_code.message}</p>
                                )}
                                <p className='text-xs text-muted-foreground'>Unique identifier for this branch</p>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='address'>Address</Label>
                            <Input id='address' placeholder='123 Business Street' {...register('address')} />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='city'>City</Label>
                            <Input id='city' placeholder='New York' {...register('city')} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='sticky bottom-0 bg-background border-t -mx-6 px-6 py-4'>
                <div className='flex justify-end gap-4'>
                    <Button type='submit' disabled={createMutation.isPending}>
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className='mr-2 size-4 animate-spin'/>
                                Creating...
                            </>
                        ) : (
                            'Create Branch'
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
