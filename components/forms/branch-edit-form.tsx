'use client'

import {useCallback} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Loader2} from 'lucide-react'
import {toast} from 'sonner'
import {branchesApi} from '@/lib/api/branches'
import {setBackendErrors} from '@/lib/error-handler'
import type {ApiError} from '@/types/errors'
import type {Branch, BranchUpdateData} from '@/types/api'

const branchEditSchema = z.object({
    branch_name: z.string().min(1, 'Branch name is required').max(200, 'Branch name is too long'),
    branch_code: z.string().min(1, 'Branch code is required').max(50, 'Branch code is too long'),
    address: z.string().max(255, 'Address is too long').optional().or(z.literal('')),
    city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
})

type BranchEditFormData = z.infer<typeof branchEditSchema>

interface BranchEditFormProps {
    branch: Branch
    onSuccess?: () => void
}

export function BranchEditForm({branch, onSuccess}: BranchEditFormProps) {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        setError,
    } = useForm<BranchEditFormData>({
        resolver: zodResolver(branchEditSchema),
        defaultValues: {
            branch_name: branch.branch_name,
            branch_code: branch.branch_code,
            address: branch.address || '',
            city: branch.city || '',
        },
    })

    const updateMutation = useMutation({
        mutationFn: async (data: BranchUpdateData) => {
            return await branchesApi.update(branch.id, data)
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['branches']})
            await queryClient.invalidateQueries({queryKey: ['branch', branch.id]})
            toast.success('Branch updated successfully!', {
                description: `${data.branch_name} has been updated.`
            })
            onSuccess?.()
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = useCallback(async (data: BranchEditFormData) => {
        const updateData: BranchUpdateData = {
            branch_name: data.branch_name,
            branch_code: data.branch_code,
            address: data.address,
            city: data.city,
        }
        updateMutation.mutate(updateData)
    }, [updateMutation])

    return (
        <form onSubmit={handleFormSubmit(onSubmit)} className='flex flex-col h-full'>
            <div className='flex-1 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Manager Information</CardTitle>
                        <CardDescription>Branch manager details (read-only)</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label>Manager Name</Label>
                                <Input value={branch.user.full_name} disabled />
                            </div>
                            <div className='space-y-2'>
                                <Label>Email</Label>
                                <Input value={branch.user.email} disabled />
                            </div>
                        </div>
                        {branch.user.phone && (
                            <div className='space-y-2'>
                                <Label>Phone</Label>
                                <Input value={branch.user.phone} disabled />
                            </div>
                        )}
                        <p className='text-xs text-muted-foreground'>
                            Note: To change manager details, please contact support or create a new branch manager.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branch Information</CardTitle>
                        <CardDescription>Update branch details</CardDescription>
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
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='address'>Address</Label>
                            <Input id='address' placeholder='123 Business Street' {...register('address')} />
                            {formErrors.address && (
                                <p className='text-sm text-destructive'>{formErrors.address.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='city'>City</Label>
                            <Input id='city' placeholder='New York' {...register('city')} />
                            {formErrors.city && (
                                <p className='text-sm text-destructive'>{formErrors.city.message}</p>
                            )}
                        </div>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label>Country</Label>
                                <Input value={branch.country_data.name} disabled />
                            </div>
                            <div className='space-y-2'>
                                <Label>Status</Label>
                                <Input value={branch.is_active ? 'Active' : 'Inactive'} disabled />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='sticky bottom-0 bg-background border-t -mx-6 px-6 py-4'>
                <div className='flex justify-end gap-4'>
                    <Button type='submit' disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className='mr-2 size-4 animate-spin'/>
                                Updating...
                            </>
                        ) : (
                            'Update Branch'
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
