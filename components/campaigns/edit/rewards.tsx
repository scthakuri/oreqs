import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {
    Badge,
    Gift,
    Plus,
    Settings2,
    Trash2,
    X,
    ImageIcon,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {toast} from 'sonner'
import {cn} from '@/lib/utils'
import {parseDjangoError} from '@/lib/error-handler'
import {ApiError} from "@/types/errors"
import {useMutation, UseQueryResult} from "@tanstack/react-query"
import {Reward, RewardCreateData, rewardsApi} from "@/lib/api/marketing/rewards"

interface RewardTotals {
    total: number
    total_available: number
    total_probability: number
}

interface RewardsQueryData {
    rewards: Reward[]
    total: number
    total_available: number
    total_probability: number
}

interface CampaignRewardsEditProps {
    campaignId: number
    rewardsQuery: UseQueryResult<RewardsQueryData, Error>
    refreshRewards: () => void
}

const rewardSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    value: z.string().min(1, 'Prize value is required').max(50, 'Value must be less than 50 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    probability: z.number()
        .min(0, 'Probability must be at least 0')
        .max(100, 'Probability cannot exceed 100'),
    total_available: z.number()
        .min(0, 'Total available must be at least 0')
        .int('Total available must be a whole number'),
    image: z.union([
        z.instanceof(File),
        z.string(),
        z.undefined(),
        z.null(),
    ]).optional(),
})

type RewardFormValues = z.infer<typeof rewardSchema>

const CampaignRewardsEdit: React.FC<CampaignRewardsEditProps> = ({
    campaignId,
    rewardsQuery,
    refreshRewards
}) => {
    const createReward = useMutation({
        mutationFn: (data: RewardCreateData | FormData) => rewardsApi.create(campaignId, data),
        onSuccess: () => {
            toast.success('Reward created successfully')
            refreshRewards()
        },
        onError: () => {
            toast.error('Failed to create reward')
        }
    })

    const updateReward = useMutation({
        mutationFn: ({id, data}: { id: number; data: RewardCreateData | FormData }) =>
            rewardsApi.update(campaignId, id, data),
        onSuccess: () => {
            toast.success('Reward updated successfully')
            refreshRewards()
        },
        onError: () => {
            toast.error('Failed to update reward')
        }
    })

    const deleteReward = useMutation({
        mutationFn: (id: number) => rewardsApi.delete(campaignId, id),
        onSuccess: () => {
            toast.success('Reward deleted successfully')
            refreshRewards()
        },
        onError: () => {
            toast.error('Failed to delete reward')
        }
    })

    const rewards = useMemo(() => (rewardsQuery.data?.rewards || []), [rewardsQuery.data?.rewards])
    const totals = useMemo(() =>
            (rewardsQuery.data || {total: 0, total_available: 0, total_probability: 0}) as RewardTotals,
        [rewardsQuery.data]
    )

    const [showRewardDialog, setShowRewardDialog] = useState(false)
    const [editingReward, setEditingReward] = useState<Reward | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [rewardToDelete, setRewardToDelete] = useState<number | null>(null)

    const form = useForm<RewardFormValues>({
        resolver: zodResolver(rewardSchema),
        defaultValues: {
            name: '',
            value: '',
            description: '',
            probability: 10,
            total_available: 100,
            image: null,
        },
    })

    const watchedProbability = form.watch('probability')

    useEffect(() => {
        if (!showRewardDialog) {
            form.reset()
            setImagePreview(null)
            setEditingReward(null)
        }
    }, [showRewardDialog, form])

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB')
            return
        }

        form.setValue('image', file)
        setImagePreview(URL.createObjectURL(file))
    }, [form])

    const handleRemoveImage = useCallback(() => {
        form.setValue('image', undefined)
        setImagePreview(null)
    }, [form])

    const onSubmit = useCallback(async (data: RewardFormValues) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('probability', String(data.probability))
        formData.append('total_available', String(data.total_available))
        formData.append('value', data.value)

        if (data.description) {
            formData.append('description', data.description)
        }

        if (data.image instanceof File) {
            formData.append('image', data.image)
        }

        try {
            if (editingReward) {
                await updateReward.mutateAsync({id: editingReward.id, data: formData})
            } else {
                await createReward.mutateAsync(formData)
            }
            setShowRewardDialog(false)
        } catch (error) {
            const errors = parseDjangoError(error as ApiError)
            Object.entries(errors).forEach(([field, message]) => {
                form.setError(field as keyof RewardFormValues, {
                    type: 'server',
                    message: message as string,
                });
            });
        }
    }, [editingReward, updateReward, createReward, form])

    const handleEditReward = useCallback((reward: Reward) => {
        setEditingReward(reward)
        form.reset({
            name: reward.name,
            value: reward.value,
            description: reward.description || '',
            probability: Number(reward.probability),
            total_available: Number(reward.total_available),
            image: null
        })

        if (reward.image) {
            setImagePreview(reward.image)
        }

        setShowRewardDialog(true)
    }, [form])

    const handleDeleteReward = useCallback((id: number) => {
        setRewardToDelete(id)
        setDeleteDialogOpen(true)
    }, [])

    const confirmDelete = useCallback(() => {
        if (rewardToDelete === null) return

        deleteReward.mutate(rewardToDelete, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setRewardToDelete(null)
            },
            onError: () => {
                setDeleteDialogOpen(false)
                setRewardToDelete(null)
            },
        })
    }, [rewardToDelete, deleteReward])

    const handleOpenDialog = useCallback(() => {
        setEditingReward(null)
        form.reset()
        setImagePreview(null)
        setShowRewardDialog(true)
    }, [form])

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        form.handleSubmit(onSubmit)(e)
    }, [form, onSubmit])

    const rewardCards = useMemo(() => (
        rewards.map((reward) => (
            <Card
                key={reward.id}
                className="relative overflow-hidden border-2 hover:shadow-lg transition-all group"
            >
                <div
                    className="absolute top-0 left-0 right-0 h-2"
                    style={{
                        background: `linear-gradient(90deg, hsl(var(--primary)) ${reward.probability}%, hsl(var(--muted)) ${reward.probability}%)`,
                    }}
                />
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg">{reward.name}</CardTitle>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditReward(reward)}
                            >
                                <Settings2 className="size-4"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReward(reward.id)}
                            >
                                <Trash2 className="size-4 text-destructive"/>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {reward.image && (
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                            <img
                                src={reward.image}
                                alt={reward.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward Value</span>
                            <span className="font-semibold">{reward.value || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Win Chance</span>
                            <span className="font-semibold text-primary">{reward.probability}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Available</span>
                            <span className="font-semibold">
                                {reward.total_available || '∞'}
                            </span>
                        </div>
                    </div>
                    {reward.description && (
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                            {reward.description}
                        </p>
                    )}
                </CardContent>
            </Card>
        ))
    ), [rewards, handleEditReward, handleDeleteReward])

    const totalStats = useMemo(() => [
        {
            title: 'Total Rewards',
            value: totals.total,
            description: 'Prize options available'
        },
        {
            title: 'Total Probability',
            value: `${totals.total_probability}%`,
            description: totals.total_probability === 100 ? 'Perfectly balanced' : 'Should equal 100%',
            valueClassName: cn(
                'text-2xl font-bold',
                totals.total_probability === 100 ? 'text-green-600' : 'text-orange-600'
            )
        },
        {
            title: 'Total Inventory',
            value: totals.total_available || '∞',
            description: 'Total prizes available'
        }
    ], [totals])

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Rewards</h1>
                    <p className="text-muted-foreground">Create and configure prize options</p>
                </div>
                <Button
                    disabled={rewardsQuery.isLoading}
                    onClick={handleOpenDialog}
                    size="lg"
                >
                    <Plus className="mr-2 size-4"/>
                    Add Reward
                </Button>
            </div>

            {!rewardsQuery.isLoading && rewards.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {rewardCards}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {totalStats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={stat.valueClassName || 'text-2xl font-bold'}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Gift className="size-12 text-muted-foreground mb-4"/>
                    <h3 className="font-semibold text-lg mb-2">Add Rewards</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Create exciting prizes for your customers
                    </p>
                    <Button
                        disabled={rewardsQuery.isLoading}
                        onClick={handleOpenDialog}
                        variant="outline"
                    >
                        <Plus className="mr-2 size-4"/> Add New Reward
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingReward ? 'Edit Reward' : 'Add New Reward'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure reward details and probability
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <div className="space-y-4" onSubmit={handleFormSubmit}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Reward Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., $10 OFF" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Reward Value *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., $10, Free Pizza" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the reward..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="probability"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Win Probability (%) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{width: `${watchedProbability}%`}}
                                                />
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="total_available"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Total Available *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="0 for unlimited"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                0 for unlimited
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="image"
                                render={({field: {value, onChange, ...field}}) => (
                                    <FormItem>
                                        <FormLabel>Reward Image (Optional)</FormLabel>
                                        <FormControl>
                                            {imagePreview ? (
                                                <div className="relative border-2 rounded-lg overflow-hidden">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Reward preview"
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <X className="size-4"/>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <ImageIcon className="size-8 mx-auto mb-2 text-muted-foreground"/>
                                                    <p className="text-sm text-muted-foreground">
                                                        Click to upload image
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        PNG, JPG up to 2MB
                                                    </p>
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowRewardDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? 'Saving...'
                                        : editingReward
                                            ? 'Update Reward'
                                            : 'Add Reward'
                                    }
                                </Button>
                            </DialogFooter>
                        </div>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the reward
                            and remove it from the campaign.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRewardToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CampaignRewardsEdit