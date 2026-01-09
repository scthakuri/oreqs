'use client'

import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Label} from '@/components/ui/label'
import {Loader2, ArrowLeft} from 'lucide-react'
import {toast} from 'sonner'
import type {ApiError} from '@/types/errors'
import Link from 'next/link'
import {Checkbox} from '@/components/ui/checkbox'
import {groupsApi} from "@/lib/api/marketing/groups";
import {Group} from "@/types/marketing/group";
import {marketingUsersApi} from "@/lib/api/marketing/users";
import {GroupFormData, groupSchema} from "@/lib/validation/marketing/users";
import {setBackendErrors} from '@/lib/error-handler'


interface GroupFormProps {
    group?: Group;
}

export function GroupForm({ group }: GroupFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const isEditMode = group !== undefined

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['marketingUsers'],
        queryFn: () => marketingUsersApi.list({ ordering: 'first_name', page: 1 }),
    });

    const users = usersData?.results || [];

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        setValue,
        watch,
        setError,
    } = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: group?.name || '',
            description: group?.description || '',
            member_ids: group?.members || [],
        },
    })

    const selectedMemberIds = watch('member_ids') || []

    const createMutation = useMutation({
        mutationFn: (data: GroupFormData) => groupsApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['groups']})
            toast.success('Group created successfully')
            router.push('/admin/marketing/groups')
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: GroupFormData) => groupsApi.update(group!.id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['groups']})
            toast.success('Group updated successfully')
            router.push('/admin/marketing/groups')
        },
        onError: (error: ApiError) => {
            setBackendErrors(error, setError)
        },
    })

    const onSubmit = (data: GroupFormData) => {
        if (isEditMode) {
            updateMutation.mutate(data)
        } else {
            createMutation.mutate(data)
        }
    }

    const toggleMember = (userId: number) => {
        const currentIds = selectedMemberIds
        if (currentIds.includes(userId)) {
            setValue('member_ids', currentIds.filter(id => id !== userId))
        } else {
            setValue('member_ids', [...currentIds, userId])
        }
    }

    if (isLoadingUsers && !isEditMode) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader2 className='size-8 animate-spin text-muted-foreground'/>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/marketing/groups'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        {isEditMode ? 'Edit Group' : 'Create Group'}
                    </h1>
                    <p className='text-muted-foreground'>
                        {isEditMode ? 'Update group information' : 'Add a new marketing group'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleFormSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Group Information</CardTitle>
                        <CardDescription>Basic group details</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='name'>Group Name *</Label>
                            <Input
                                id='name'
                                {...register('name')}
                                placeholder='VIP Customers'
                            />
                            {formErrors.name && (
                                <p className='text-sm text-destructive'>{formErrors.name.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                {...register('description')}
                                placeholder='Group description...'
                                rows={3}
                            />
                            {formErrors.description && (
                                <p className='text-sm text-destructive'>{formErrors.description.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>Select users to add to this group</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2 max-h-96 overflow-y-auto'>
                            {users.map((user) => (
                                <div key={user.id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`user-${user.id}`}
                                        checked={selectedMemberIds.includes(user.id)}
                                        onCheckedChange={() => toggleMember(user.id)}
                                    />
                                    <Label
                                        htmlFor={`user-${user.id}`}
                                        className='flex-1 cursor-pointer'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='font-medium'>{user.full_name}</p>
                                                <p className='text-sm text-muted-foreground'>
                                                    {user.email || user.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {formErrors.member_ids && (
                            <p className='text-sm text-destructive mt-2'>{formErrors.member_ids.message}</p>
                        )}
                    </CardContent>
                </Card>

                <div className='flex justify-end gap-4'>
                    <Link href='/admin/marketing/groups'>
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
                        {isEditMode ? 'Update Group' : 'Create Group'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
