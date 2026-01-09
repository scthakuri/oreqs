'use client'

import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Loader2, ArrowLeft} from 'lucide-react'
import {toast} from 'sonner'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'
import {Checkbox} from '@/components/ui/checkbox'
import {MarketingUserFormData, marketingUserSchema} from "@/lib/validation/marketing/users";
import {marketingUsersApi} from "@/lib/api/marketing/users";
import {groupsApi} from "@/lib/api/marketing/groups";
import {MarketingUser} from "@/types/marketing/user";

interface UserFormProps {
    user?: MarketingUser;
}

export function UserForm({ user }: UserFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const isEditMode = user !== undefined

    const {data: groupsData, isLoading: isLoadingGroups} = useQuery({
        queryKey: ['groups', 'all'],
        queryFn: () => groupsApi.list({
            ordering: 'name',
            page_size: 1000,
        }),
    })

    const groups = groupsData?.results || []

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        setValue,
        watch,
    } = useForm<MarketingUserFormData>({
        resolver: zodResolver(marketingUserSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            group_ids: user?.groups || [],
        },
    })

    const selectedGroupIds = watch('group_ids') || []

    useEffect(() => {
        if (user) {
            setValue('first_name', user.first_name)
            setValue('last_name', user.last_name)
            setValue('email', user.email || '')
            setValue('phone', user.phone || '')
            setValue('group_ids', user.groups)
        }
    }, [user, setValue])

    const createMutation = useMutation({
        mutationFn: (data: MarketingUserFormData) => marketingUsersApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['marketing-users']})
            await queryClient.invalidateQueries({queryKey: ['marketing-stats']})
            toast.success('User created successfully')
            router.push('/admin/marketing/users')
        },
        onError: (error: ApiError) => {
            const errorData = error.response?.data
            if (errorData && typeof errorData === 'object') {
                Object.entries(errorData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        toast.error(value[0])
                    }
                })
            } else {
                toast.error('Failed to create user')
            }
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: MarketingUserFormData) => marketingUsersApi.update(user!.id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['marketing-users']})
            toast.success('User updated successfully')
            router.push('/admin/marketing/users')
        },
        onError: (error: ApiError) => {
            const errorData = error.response?.data
            if (errorData && typeof errorData === 'object') {
                Object.entries(errorData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        toast.error(value[0])
                    }
                })
            } else {
                toast.error('Failed to update user')
            }
        },
    })

    const onSubmit = (data: MarketingUserFormData) => {
        if (isEditMode) {
            updateMutation.mutate(data)
        } else {
            createMutation.mutate(data)
        }
    }

    const toggleGroup = (groupId: number) => {
        const currentIds = selectedGroupIds
        if (currentIds.includes(groupId)) {
            setValue('group_ids', currentIds.filter(id => id !== groupId))
        } else {
            setValue('group_ids', [...currentIds, groupId])
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/marketing/users'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        {isEditMode ? 'Edit User' : 'Create User'}
                    </h1>
                    <p className='text-muted-foreground'>
                        {isEditMode ? 'Update user information' : 'Add a new marketing user'}
                    </p>
                </div>
            </div>
            <form onSubmit={handleFormSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Basic user details</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='first_name'>First Name *</Label>
                                <Input
                                    id='first_name'
                                    {...register('first_name')}
                                    placeholder='John'
                                />
                                {formErrors.first_name && (
                                    <p className='text-sm text-destructive'>{formErrors.first_name.message}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='last_name'>Last Name *</Label>
                                <Input
                                    id='last_name'
                                    {...register('last_name')}
                                    placeholder='Doe'
                                />
                                {formErrors.last_name && (
                                    <p className='text-sm text-destructive'>{formErrors.last_name.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                {...register('email')}
                                placeholder='john.doe@example.com'
                            />
                            {formErrors.email && (
                                <p className='text-sm text-destructive'>{formErrors.email.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='phone'>Phone</Label>
                            <Input
                                id='phone'
                                {...register('phone')}
                                placeholder='+1234567890'
                            />
                            {formErrors.phone && (
                                <p className='text-sm text-destructive'>{formErrors.phone.message}</p>
                            )}
                            <p className='text-xs text-muted-foreground'>
                                At least one of email or phone is required
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Groups</CardTitle>
                        <CardDescription>Assign user to groups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingGroups ? (
                            <div className='flex items-center justify-center py-8'>
                                <Loader2 className='size-6 animate-spin text-muted-foreground'/>
                            </div>
                        ) : (
                            <div className='space-y-2 max-h-96 overflow-y-auto'>
                                {groups.length === 0 ? (
                                    <p className='text-sm text-muted-foreground'>No groups available</p>
                                ) : (
                                    groups.map((group) => (
                                        <div key={group.id} className='flex items-center space-x-2'>
                                            <Checkbox
                                                id={`group-${group.id}`}
                                                checked={selectedGroupIds.includes(group.id)}
                                                onCheckedChange={() => toggleGroup(group.id)}
                                            />
                                            <Label
                                                htmlFor={`group-${group.id}`}
                                                className='flex-1 cursor-pointer'
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='font-medium'>{group.name}</p>
                                                        <p className='text-sm text-muted-foreground'>
                                                            {group.member_count} members
                                                        </p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className='flex justify-end gap-4'>
                    <Link href='/admin/marketing/users'>
                        <Button type='button' variant='outline'>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type='submit'
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {(createMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className='mr-2 size-4 animate-spin'/>
                        )}
                        {isEditMode ? 'Update User' : 'Create User'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
