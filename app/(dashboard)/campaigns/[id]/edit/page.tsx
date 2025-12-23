'use client'

import {useState, useEffect} from 'react'
import {useSidebar} from '@/components/ui/sidebar'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Calendar} from '@/components/ui/calendar'
import {
    Gift,
    Image as ImageIcon,
    Trash2,
    Plus,
    FormInput,
    Settings2,
    Sparkles,
    Save,
    Calendar as CalendarIcon,
    Info,
    Smartphone,
    Upload,
    X,
    Percent,
    DollarSign,
    Package,
    Play,
} from 'lucide-react'
import {toast} from 'sonner'
import {cn} from '@/lib/utils'
import {format} from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import WheelSpinner from '@/components/wheel-spinner'

type Reward = {
    id: string
    name: string
    image?: string
    type: 'discount' | 'product' | 'cashback'
    value: string
    probability: number
    total: number
    description?: string
}

type FormField = {
    id: string
    label: string
    type: 'text' | 'email' | 'phone' | 'select' | 'checkbox'
    required: boolean
    options?: string[]
}

const Page = ({params}: { params: { id: string } }) => {
    const {open: sidebarOpen, setOpen: setSidebarOpen} = useSidebar()
    const [activeSection, setActiveSection] = useState<'details' | 'rewards' | 'form' | 'settings'>('details')

    // Helper function to get reward icon
    const getRewardIcon = (type: string, className?: string) => {
        switch (type) {
            case 'discount':
                return <Percent className={className}/>
            case 'cashback':
                return <DollarSign className={className}/>
            case 'product':
                return <Package className={className}/>
            default:
                return <Gift className={className}/>
        }
    }
    const [showRewardDialog, setShowRewardDialog] = useState(false)
    const [showFormFieldDialog, setShowFormFieldDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showPlayLimitDialog, setShowPlayLimitDialog] = useState(false)
    const [showSmsDialog, setShowSmsDialog] = useState(false)
    const [showExpiryDialog, setShowExpiryDialog] = useState(false)
    const [editingReward, setEditingReward] = useState<Reward | null>(null)
    const [editingField, setEditingField] = useState<FormField | null>(null)

    // Campaign data
    const [campaignName, setCampaignName] = useState('Summer Discount 2024')
    const [campaignType, setCampaignType] = useState('Scratch Card')
    const [campaignDescription, setCampaignDescription] = useState('Win amazing prizes this summer!')
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 5, 1))
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(2024, 7, 31))
    const [selectedClient, setSelectedClient] = useState('1')
    const [campaignStatus, setCampaignStatus] = useState('Active')

    // Rewards data
    const [rewards, setRewards] = useState<Reward[]>([
        {
            id: '1',
            name: '$10 OFF',
            type: 'discount',
            value: '$10',
            probability: 15,
            total: 100,
            description: 'Get $10 off your next purchase',
        },
        {
            id: '2',
            name: 'Free Pizza',
            type: 'product',
            value: 'Free',
            probability: 20,
            total: 200,
            description: 'Enjoy a free medium pizza',
        },
        {
            id: '3',
            name: 'No Prize',
            type: 'product',
            value: 'Better luck next time',
            probability: 65,
            total: 0,
            description: 'Try again!',
        },
    ])

    // Form fields
    const [formFields, setFormFields] = useState<FormField[]>([
        {id: '1', label: 'Full Name', type: 'text', required: true},
        {id: '2', label: 'Email', type: 'email', required: true},
        {id: '3', label: 'Phone Number', type: 'phone', required: false},
    ])

    const [newReward, setNewReward] = useState<Reward>({
        id: '',
        name: '',
        type: 'discount',
        value: '',
        probability: 10,
        total: 100,
        description: '',
    })

    const [newField, setNewField] = useState<FormField>({
        id: '',
        label: '',
        type: 'text',
        required: false,
    })

    // Campaign Settings
    const [playLimitEnabled, setPlayLimitEnabled] = useState(true)
    const [playLimitValue, setPlayLimitValue] = useState(1)
    const [smsEnabled, setSmsEnabled] = useState(true)
    const [rewardExpiryDays, setRewardExpiryDays] = useState(7)
    const [autoApproveRewards, setAutoApproveRewards] = useState(true)
    const [showBranding, setShowBranding] = useState(true)
    const [allowSocialShare, setAllowSocialShare] = useState(true)

    // Scratch card image
    const [scratchCardImage, setScratchCardImage] = useState<string | null>(null)

    // Collapse sidebar on mount, restore on unmount
    useEffect(() => {
        const previousState = sidebarOpen
        setSidebarOpen(false)

        return () => {
            setSidebarOpen(previousState)
        }
    }, [])

    const handleAddReward = () => {
        if (!newReward.name.trim()) {
            toast.error('Please enter a reward name')
            return
        }
        if (!newReward.value.trim()) {
            toast.error('Please enter a prize value')
            return
        }
        if (newReward.probability < 0 || newReward.probability > 100) {
            toast.error('Probability must be between 0 and 100')
            return
        }

        if (editingReward) {
            setRewards(rewards.map(r => r.id === editingReward.id ? newReward : r))
            toast.success('Reward updated successfully!')
        } else {
            setRewards([...rewards, {...newReward, id: Date.now().toString()}])
            toast.success('Reward added successfully!')
        }
        setShowRewardDialog(false)
        setNewReward({id: '', name: '', type: 'discount', value: '', probability: 10, total: 100})
        setEditingReward(null)
    }

    const handleEditReward = (reward: Reward) => {
        setEditingReward(reward)
        setNewReward(reward)
        setShowRewardDialog(true)
    }

    const handleDeleteReward = (id: string) => {
        setRewards(rewards.filter(r => r.id !== id))
        toast.error('Reward deleted')
    }

    const handleAddField = () => {
        if (!newField.label.trim()) {
            toast.error('Please enter a field label')
            return
        }
        if (newField.type === 'select' && (!newField.options || newField.options.length === 0)) {
            toast.error('Please provide options for the select field')
            return
        }

        if (editingField) {
            setFormFields(formFields.map(f => f.id === editingField.id ? newField : f))
            toast.success('Field updated successfully!')
        } else {
            setFormFields([...formFields, {...newField, id: Date.now().toString()}])
            toast.success('Field added successfully!')
        }
        setShowFormFieldDialog(false)
        setNewField({id: '', label: '', type: 'text', required: false})
        setEditingField(null)
    }

    const handleEditField = (field: FormField) => {
        setEditingField(field)
        setNewField(field)
        setShowFormFieldDialog(true)
    }

    const handleDeleteField = (id: string) => {
        setFormFields(formFields.filter(f => f.id !== id))
        toast.error('Field deleted')
    }

    const handleSaveCampaign = () => {
        toast.success('Campaign updated successfully!')
    }

    const handleDeleteCampaign = () => {
        setShowDeleteDialog(false)
        toast.error('Campaign deleted successfully')
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setScratchCardImage(reader.result as string)
                toast.success('Image uploaded successfully')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setScratchCardImage(null)
        toast.success('Image removed')
    }

    const menuItems = [
        {id: 'details', label: 'Campaign Details', icon: Info},
        {id: 'rewards', label: 'Manage Rewards', icon: Gift},
        {id: 'form', label: 'Registration Form', icon: FormInput},
        {id: 'settings', label: 'Advanced Settings', icon: Settings2},
    ]

    return (
        <div className='h-screen flex bg-background'>
            {/* Left Sidebar - Campaign Sections */}
            <div className='w-64 border-r bg-muted/30 p-4 overflow-y-auto flex-shrink-0'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-2 mb-6'>
                        <Sparkles className='size-5 text-primary'/>
                        <h2 className='font-semibold text-lg'>Edit Campaign</h2>
                    </div>
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                                    activeSection === item.id
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'hover:bg-muted'
                                )}
                            >
                                <Icon className='size-4'/>
                                <span className='text-sm font-medium'>{item.label}</span>
                            </button>
                        )
                    })}

                    <Separator className='my-4'/>

                    <Link href={`/campaigns/${params.id}`}>
                        <Button variant='outline' className='w-full'>
                            View Campaign
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-y-auto p-8 pb-24 pr-4'>
                <div className='w-full space-y-6'>
                    {/* Campaign Details Section */}
                    {activeSection === 'details' && (
                        <div className='space-y-6 animate-in fade-in-50 duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h1 className='text-3xl font-bold'>Campaign Details</h1>
                                    <p className='text-muted-foreground'>Update your campaign basic information</p>
                                </div>
                                <Badge variant={campaignStatus === 'Active' ? 'default' : 'secondary'}>
                                    {campaignStatus}
                                </Badge>
                            </div>

                            <Card className='border-2'>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Essential details about your campaign</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-6'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name'>Campaign Name *</Label>
                                        <Input
                                            id='name'
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            placeholder='Enter campaign name'
                                            className='text-lg font-semibold'
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

                                    <div className='space-y-4'>
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
                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='client'>Client *</Label>
                                                <Select value={selectedClient} onValueChange={setSelectedClient}>
                                                    <SelectTrigger id='client'>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='1'>Pizza Palace</SelectItem>
                                                        <SelectItem value='2'>Burger King</SelectItem>
                                                        <SelectItem value='3'>Starbucks</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor='status'>Status *</Label>
                                                <Select value={campaignStatus} onValueChange={setCampaignStatus}>
                                                    <SelectTrigger id='status'>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='Active'>Active</SelectItem>
                                                        <SelectItem value='Paused'>Paused</SelectItem>
                                                        <SelectItem value='Draft'>Draft</SelectItem>
                                                        <SelectItem value='Completed'>Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
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

                                    {/* Scratch Card Image Upload */}
                                    {campaignType === 'Scratch Card' && (
                                        <div className='space-y-2'>
                                            <Label>Scratch Card Image</Label>
                                            <p className='text-xs text-muted-foreground'>
                                                Upload an image that will be shown on the scratch card (Optional)
                                            </p>
                                            {scratchCardImage ? (
                                                <div className='relative border-2 rounded-lg overflow-hidden'>
                                                    <img
                                                        src={scratchCardImage}
                                                        alt='Scratch card'
                                                        className='w-full h-48 object-cover'
                                                    />
                                                    <Button
                                                        variant='destructive'
                                                        size='icon'
                                                        className='absolute top-2 right-2'
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <X className='size-4'/>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className='border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors relative'>
                                                    <input
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={handleImageUpload}
                                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                    />
                                                    <Upload className='size-8 mx-auto mb-2 text-muted-foreground'/>
                                                    <p className='text-sm font-medium'>Click to upload image</p>
                                                    <p className='text-xs text-muted-foreground mt-1'>
                                                        PNG, JPG up to 5MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Rewards Section */}
                    {activeSection === 'rewards' && (
                        <div className='space-y-6 animate-in fade-in-50 duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h1 className='text-3xl font-bold'>Manage Rewards</h1>
                                    <p className='text-muted-foreground'>Create and configure prize options</p>
                                </div>
                                <Button onClick={() => setShowRewardDialog(true)} size='lg'>
                                    <Plus className='mr-2 size-4'/>
                                    Add Reward
                                </Button>
                            </div>

                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {rewards.map((reward) => (
                                    <Card
                                        key={reward.id}
                                        className='relative overflow-hidden border-2 hover:shadow-lg transition-all group'
                                    >
                                        <div
                                            className='absolute top-0 left-0 right-0 h-2'
                                            style={{
                                                background: `linear-gradient(90deg, hsl(var(--primary)) ${reward.probability}%, hsl(var(--muted)) ${reward.probability}%)`,
                                            }}
                                        />
                                        <CardHeader className='pb-4'>
                                            <div className='flex items-start justify-between'>
                                                <div className='flex-1'>
                                                    <CardTitle className='text-lg'>{reward.name}</CardTitle>
                                                    <Badge variant='outline' className='mt-2'>
                                                        {reward.type}
                                                    </Badge>
                                                </div>
                                                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => handleEditReward(reward)}
                                                    >
                                                        <Settings2 className='size-4'/>
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => handleDeleteReward(reward.id)}
                                                    >
                                                        <Trash2 className='size-4 text-destructive'/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className='space-y-3'>
                                            {reward.image && (
                                                <div className='aspect-video bg-muted rounded-md overflow-hidden'>
                                                    <img
                                                        src={reward.image}
                                                        alt={reward.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                            )}
                                            <div className='space-y-2'>
                                                <div className='flex justify-between text-sm'>
                                                    <span className='text-muted-foreground'>Prize Value</span>
                                                    <span className='font-semibold'>{reward.value}</span>
                                                </div>
                                                <div className='flex justify-between text-sm'>
                                                    <span className='text-muted-foreground'>Win Chance</span>
                                                    <span className='font-semibold text-primary'>{reward.probability}%</span>
                                                </div>
                                                <div className='flex justify-between text-sm'>
                                                    <span className='text-muted-foreground'>Total Available</span>
                                                    <span className='font-semibold'>{reward.total || '∞'}</span>
                                                </div>
                                            </div>
                                            {reward.description && (
                                                <p className='text-xs text-muted-foreground pt-2 border-t'>
                                                    {reward.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Reward Statistics */}
                            {rewards.length > 0 && (
                                <div className='grid gap-4 md:grid-cols-3'>
                                    <Card>
                                        <CardHeader className='pb-3'>
                                            <CardTitle className='text-sm font-medium text-muted-foreground'>
                                                Total Rewards
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='text-2xl font-bold'>{rewards.length}</div>
                                            <p className='text-xs text-muted-foreground mt-1'>
                                                Prize options available
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className='pb-3'>
                                            <CardTitle className='text-sm font-medium text-muted-foreground'>
                                                Total Probability
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={cn(
                                                'text-2xl font-bold',
                                                rewards.reduce((sum, r) => sum + r.probability, 0) === 100
                                                    ? 'text-green-600'
                                                    : 'text-orange-600'
                                            )}>
                                                {rewards.reduce((sum, r) => sum + r.probability, 0)}%
                                            </div>
                                            <p className='text-xs text-muted-foreground mt-1'>
                                                {rewards.reduce((sum, r) => sum + r.probability, 0) === 100
                                                    ? 'Perfectly balanced'
                                                    : 'Should equal 100%'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className='pb-3'>
                                            <CardTitle className='text-sm font-medium text-muted-foreground'>
                                                Total Inventory
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='text-2xl font-bold'>
                                                {rewards.reduce((sum, r) => sum + (r.total || 0), 0) || '∞'}
                                            </div>
                                            <p className='text-xs text-muted-foreground mt-1'>
                                                Total prizes available
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <Card className='border-dashed border-2 bg-muted/20'>
                                <CardContent className='flex flex-col items-center justify-center py-12'>
                                    <Gift className='size-12 text-muted-foreground mb-4'/>
                                    <h3 className='font-semibold text-lg mb-2'>Add More Rewards</h3>
                                    <p className='text-sm text-muted-foreground mb-4'>Create exciting prizes for your customers</p>
                                    <Button onClick={() => setShowRewardDialog(true)} variant='outline'>
                                        <Plus className='mr-2 size-4'/>
                                        Add New Reward
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'form' && (
                        <div className='space-y-6 animate-in fade-in-50 duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h1 className='text-3xl font-bold'>Registration Form</h1>
                                    <p className='text-muted-foreground'>Customize user registration fields</p>
                                </div>
                                <Button onClick={() => setShowFormFieldDialog(true)} size='lg'>
                                    <Plus className='mr-2 size-4'/>
                                    Add Field
                                </Button>
                            </div>

                            <div className='grid gap-4'>
                                {formFields.map((field, index) => (
                                    <Card key={field.id} className='border-2 hover:shadow-md transition-all group py-4'>
                                        <CardContent className='flex items-center gap-4 px-2'>
                                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold'>
                                                {index + 1}
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-semibold'>{field.label}</span>
                                                    {field.required && (
                                                        <Badge variant='destructive' className='text-xs'>Required</Badge>
                                                    )}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>Type: {field.type}</p>
                                                {field.options && (
                                                    <p className='text-xs text-muted-foreground mt-1'>
                                                        Options: {field.options.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handleEditField(field)}
                                                >
                                                    <Settings2 className='size-4'/>
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handleDeleteField(field.id)}
                                                >
                                                    <Trash2 className='size-4 text-destructive'/>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <div className='space-y-6 animate-in fade-in-50 duration-300'>
                            <div>
                                <h1 className='text-3xl font-bold'>Advanced Settings</h1>
                                <p className='text-muted-foreground'>Configure additional campaign options</p>
                            </div>

                            <Card className='border-2'>
                                <CardHeader>
                                    <CardTitle>Play Restrictions</CardTitle>
                                    <CardDescription>Control how users can participate</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Play Limit</p>
                                            <p className='text-sm text-muted-foreground'>
                                                {playLimitEnabled ? `${playLimitValue} play per user` : 'Unlimited plays'}
                                            </p>
                                        </div>
                                        <Button variant='outline' onClick={() => setShowPlayLimitDialog(true)}>
                                            Configure
                                        </Button>
                                    </div>
                                    <Separator/>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Reward Expiry</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Rewards expire in {rewardExpiryDays} days
                                            </p>
                                        </div>
                                        <Button variant='outline' onClick={() => setShowExpiryDialog(true)}>
                                            Configure
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='border-2'>
                                <CardHeader>
                                    <CardTitle>Notifications & Communication</CardTitle>
                                    <CardDescription>Manage user communications</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>SMS Notifications</p>
                                            <p className='text-sm text-muted-foreground'>
                                                {smsEnabled ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                        <Button variant='outline' onClick={() => setShowSmsDialog(true)}>
                                            Configure
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='border-2'>
                                <CardHeader>
                                    <CardTitle>Reward Management</CardTitle>
                                    <CardDescription>Reward approval and validation</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Auto-Approve Rewards</p>
                                            <p className='text-sm text-muted-foreground'>
                                                {autoApproveRewards ? 'Rewards approved automatically' : 'Manual approval required'}
                                            </p>
                                        </div>
                                        <Select value={autoApproveRewards.toString()} onValueChange={(v) => setAutoApproveRewards(v === 'true')}>
                                            <SelectTrigger className='w-32'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='true'>Enabled</SelectItem>
                                                <SelectItem value='false'>Disabled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='border-2'>
                                <CardHeader>
                                    <CardTitle>Display & Branding</CardTitle>
                                    <CardDescription>Customize campaign appearance</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Show Platform Branding</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Display "Powered by OREQS"
                                            </p>
                                        </div>
                                        <Select value={showBranding.toString()} onValueChange={(v) => setShowBranding(v === 'true')}>
                                            <SelectTrigger className='w-32'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='true'>Show</SelectItem>
                                                <SelectItem value='false'>Hide</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Separator/>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Social Sharing</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Allow users to share on social media
                                            </p>
                                        </div>
                                        <Select value={allowSocialShare.toString()} onValueChange={(v) => setAllowSocialShare(v === 'true')}>
                                            <SelectTrigger className='w-32'>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='true'>Enabled</SelectItem>
                                                <SelectItem value='false'>Disabled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='border-2 border-destructive/50'>
                                <CardHeader>
                                    <CardTitle className='text-destructive'>Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>Delete Campaign</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Permanently remove this campaign and all its data
                                            </p>
                                        </div>
                                        <Button variant='destructive' onClick={() => setShowDeleteDialog(true)}>
                                            <Trash2 className='mr-2 size-4'/>
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Mobile Preview */}
            <div className='w-96 border-l bg-muted/30 p-6 overflow-y-auto flex-shrink-0'>
                <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <Smartphone className='size-5 text-primary'/>
                        <h2 className='font-semibold text-lg'>Mobile Preview</h2>
                    </div>

                    {/* Mobile Frame */}
                    <div className='mx-auto' style={{width: '320px'}}>
                        <div className='relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl'>
                            {/* Phone notch */}
                            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-10'/>

                            {/* Screen */}
                            <div className='relative bg-white rounded-[2.5rem] overflow-hidden' style={{height: '600px'}}>
                                <div className='h-full overflow-y-auto'>
                                    {/* Preview Content */}
                                    <div className='h-full flex flex-col'>
                                        {/* Logo Header */}
                                        <div className='p-4 border-b bg-white'>
                                            <div className='flex items-center justify-center'>
                                                <Image
                                                    src='/branding/logo.svg'
                                                    alt='OREQS'
                                                    width={80}
                                                    height={24}
                                                    className='h-6 w-auto'
                                                />
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className='flex-1 p-6 space-y-4 overflow-y-auto'>
                                            {/* Campaign Header */}
                                            <div className='text-center space-y-2'>
                                                <h1 className='text-xl font-bold text-slate-900'>
                                                    {campaignName || 'Campaign Name'}
                                                </h1>
                                                {campaignDescription && (
                                                    <p className='text-sm text-slate-600'>
                                                        {campaignDescription}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Game Preview - Always Visible */}
                                            <div className='space-y-4'>
                                                {/* Scratch Card */}
                                                {campaignType === 'Scratch Card' && (
                                                    <div className='relative aspect-[4/3] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl shadow-xl overflow-hidden'>
                                                        {scratchCardImage ? (
                                                            <>
                                                                {/* Custom uploaded image */}
                                                                <img
                                                                    src={scratchCardImage}
                                                                    alt='Scratch card'
                                                                    className='absolute inset-0 w-full h-full object-cover'
                                                                />
                                                                {/* Scratch texture overlay */}
                                                                <div className='absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 opacity-30 mix-blend-overlay'
                                                                     style={{
                                                                         backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'20\' height=\'20\' fill=\'%23fff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")',
                                                                         backgroundSize: '4px 4px'
                                                                     }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* Default scratch card design */}
                                                                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]'/>
                                                                <div className='relative h-full flex flex-col items-center justify-center p-6'>
                                                                    <div className='text-center space-y-3'>
                                                                        <div className='text-5xl'>🎁</div>
                                                                        <p className='text-white font-bold text-xl drop-shadow-lg'>
                                                                            Scratch to Reveal
                                                                        </p>
                                                                        <p className='text-white/90 text-sm'>
                                                                            Your Prize Awaits!
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {/* Scratch texture overlay */}
                                                                <div className='absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 opacity-20 mix-blend-overlay'
                                                                     style={{
                                                                         backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'20\' height=\'20\' fill=\'%23fff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")',
                                                                         backgroundSize: '4px 4px'
                                                                     }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Spin Wheel */}
                                                {campaignType === 'Spin Wheel' && rewards.length > 0 && (
                                                    <div className='flex justify-center items-center'>
                                                        <WheelSpinner
                                                            segments={rewards.map((reward, i) => {
                                                                const colors = [
                                                                    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
                                                                    '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'
                                                                ]
                                                                return {
                                                                    name: reward.name,
                                                                    color: colors[i % colors.length],
                                                                    probability: reward.probability
                                                                }
                                                            })}
                                                            onFinished={(segment) => {
                                                                const wonReward = rewards.find(r => r.name === segment)
                                                                if (wonReward) {
                                                                    toast.success(`🎉 You won: ${wonReward.name}!`, {
                                                                        description: wonReward.value,
                                                                        duration: 4000
                                                                    })
                                                                }
                                                            }}
                                                            size={140}
                                                            buttonText='SPIN'
                                                            primaryColor='#1e293b'
                                                            contrastColor='#ffffff'
                                                        />
                                                    </div>
                                                )}

                                                {/* Slot Machine */}
                                                {campaignType === 'Slot Machine' && (
                                                    <div className='relative'>
                                                        <div className='bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border-4 border-amber-400'>
                                                            {/* Slot display */}
                                                            <div className='bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-4 mb-4 border-2 border-slate-700'>
                                                                <div className='grid grid-cols-3 gap-3'>
                                                                    {[0, 1, 2].map((reelIndex) => {
                                                                        const reward = rewards[reelIndex % rewards.length]
                                                                        return (
                                                                            <div key={reelIndex} className='bg-white rounded-lg p-3 flex flex-col items-center justify-center shadow-lg min-h-[80px] border-2 border-slate-200'>
                                                                                {reward?.image ? (
                                                                                    <>
                                                                                        <img
                                                                                            src={reward.image}
                                                                                            alt={reward.name}
                                                                                            className='w-12 h-12 object-contain mb-1'
                                                                                        />
                                                                                        <span className='text-[9px] font-bold text-slate-900 text-center leading-tight'>
                                                                                            {reward.name.length > 8
                                                                                                ? reward.name.substring(0, 7) + '..'
                                                                                                : reward.name}
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span className='text-sm font-bold text-slate-900 text-center leading-tight px-1'>
                                                                                        {reward?.name.length > 10
                                                                                            ? reward.name.substring(0, 9) + '..'
                                                                                            : reward?.name || '?'}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                            {/* Pull handle indicator */}
                                                            <div className='text-center'>
                                                                <div className='inline-flex items-center gap-2 text-amber-300 text-sm font-bold'>
                                                                    <Play className='size-4'/>
                                                                    <span>Tap to Spin</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Campaign Info */}
                                                <div className='text-center text-xs text-slate-500 space-y-1 pt-2'>
                                                    <p>Campaign ends: {endDate ? format(endDate, 'MMM dd, yyyy') : 'Not set'}</p>
                                                    {playLimitEnabled && (
                                                        <p>{playLimitValue} {playLimitValue === 1 ? 'play' : 'plays'} per user</p>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Footer Branding */}
                                            {showBranding && (
                                                <div className='text-center pt-4 border-t mt-6'>
                                                    <p className='text-xs text-slate-400'>Powered by OREQS</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone home indicator */}
                            <div className='absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full'/>
                        </div>

                        <p className='text-xs text-center text-muted-foreground mt-4'>
                            Live preview updates as you edit
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div
                className={cn(
                    'fixed bottom-0 right-96 bg-background border-t p-4 flex items-center justify-between transition-all',
                    sidebarOpen ? 'left-64' : 'left-12'
                )}
            >
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Settings2 className='size-4'/>
                    <span>Changes saved automatically</span>
                </div>
                <div className='flex gap-2'>
                    <Link href={`/campaigns/${params.id}`}>
                        <Button variant='outline'>Cancel</Button>
                    </Link>
                    <Button onClick={handleSaveCampaign} size='lg'>
                        <Save className='mr-2 size-4'/>
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Add/Edit Reward Dialog */}
            <Dialog open={showRewardDialog} onOpenChange={(open) => {
                setShowRewardDialog(open)
                if (!open) {
                    setNewReward({id: '', name: '', type: 'discount', value: '', probability: 10, total: 100})
                    setEditingReward(null)
                }
            }}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>{editingReward ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
                        <DialogDescription>Configure reward details and probability</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='rewardName'>Reward Name *</Label>
                                <Input
                                    id='rewardName'
                                    value={newReward.name}
                                    onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                                    placeholder='e.g., $10 OFF'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='rewardType'>Reward Type *</Label>
                                <Select
                                    value={newReward.type}
                                    onValueChange={(value: any) => setNewReward({...newReward, type: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='discount'>
                                            <div className='flex items-center gap-2'>
                                                <Percent className='size-4'/>
                                                <span>Discount</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value='product'>
                                            <div className='flex items-center gap-2'>
                                                <Package className='size-4'/>
                                                <span>Product</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value='cashback'>
                                            <div className='flex items-center gap-2'>
                                                <DollarSign className='size-4'/>
                                                <span>Cashback</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='rewardValue'>Prize Value *</Label>
                            <Input
                                id='rewardValue'
                                value={newReward.value}
                                onChange={(e) => setNewReward({...newReward, value: e.target.value})}
                                placeholder='e.g., $10, Free Pizza'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='rewardDescription'>Description</Label>
                            <Textarea
                                id='rewardDescription'
                                value={newReward.description}
                                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                                rows={3}
                                placeholder='Describe the reward...'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='probability'>Win Probability (%) *</Label>
                                <Input
                                    id='probability'
                                    type='number'
                                    min='0'
                                    max='100'
                                    value={newReward.probability}
                                    onChange={(e) => setNewReward({...newReward, probability: Number(e.target.value)})}
                                />
                                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                                    <div
                                        className='h-full bg-primary transition-all'
                                        style={{width: `${newReward.probability}%`}}
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='total'>Total Available *</Label>
                                <Input
                                    id='total'
                                    type='number'
                                    min='0'
                                    value={newReward.total}
                                    onChange={(e) => setNewReward({...newReward, total: Number(e.target.value)})}
                                    placeholder='0 for unlimited'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label>Reward Image (Optional)</Label>
                            <p className='text-xs text-muted-foreground mb-2'>
                                Upload an image for this reward (shown in wheel/slots)
                            </p>
                            {newReward.image ? (
                                <div className='relative border-2 rounded-lg overflow-hidden'>
                                    <img
                                        src={newReward.image}
                                        alt='Reward'
                                        className='w-full h-32 object-cover'
                                    />
                                    <Button
                                        variant='destructive'
                                        size='icon'
                                        className='absolute top-2 right-2'
                                        onClick={() => setNewReward({...newReward, image: undefined})}
                                    >
                                        <X className='size-4'/>
                                    </Button>
                                </div>
                            ) : (
                                <div className='border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors relative'>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    toast.error('Image size should be less than 2MB')
                                                    return
                                                }
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                    setNewReward({...newReward, image: reader.result as string})
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }}
                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                    />
                                    <ImageIcon className='size-8 mx-auto mb-2 text-muted-foreground'/>
                                    <p className='text-sm text-muted-foreground'>Click to upload image</p>
                                    <p className='text-xs text-muted-foreground mt-1'>PNG, JPG up to 2MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setShowRewardDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddReward}>
                            {editingReward ? 'Update Reward' : 'Add Reward'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Form Field Dialog */}
            <Dialog open={showFormFieldDialog} onOpenChange={(open) => {
                setShowFormFieldDialog(open)
                if (!open) {
                    setNewField({id: '', label: '', type: 'text', required: false})
                    setEditingField(null)
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingField ? 'Edit Field' : 'Add Form Field'}</DialogTitle>
                        <DialogDescription>Configure registration form field</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='fieldLabel'>Field Label *</Label>
                            <Input
                                id='fieldLabel'
                                value={newField.label}
                                onChange={(e) => setNewField({...newField, label: e.target.value})}
                                placeholder='e.g., Full Name, Phone Number'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='fieldType'>Field Type *</Label>
                            <Select
                                value={newField.type}
                                onValueChange={(value: any) => setNewField({...newField, type: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='text'>Text Input</SelectItem>
                                    <SelectItem value='email'>Email</SelectItem>
                                    <SelectItem value='phone'>Phone Number</SelectItem>
                                    <SelectItem value='select'>Dropdown Select</SelectItem>
                                    <SelectItem value='checkbox'>Checkbox</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {newField.type === 'select' && (
                            <div className='space-y-2'>
                                <Label htmlFor='fieldOptions'>Options (comma-separated)</Label>
                                <Input
                                    id='fieldOptions'
                                    value={newField.options?.join(', ') || ''}
                                    onChange={(e) => setNewField({
                                        ...newField,
                                        options: e.target.value.split(',').map(o => o.trim())
                                    })}
                                    placeholder='Option 1, Option 2, Option 3'
                                />
                            </div>
                        )}
                        <div className='flex items-center justify-between p-4 border rounded-lg'>
                            <div>
                                <p className='font-medium'>Required Field</p>
                                <p className='text-sm text-muted-foreground'>User must fill this field</p>
                            </div>
                            <Select
                                value={newField.required.toString()}
                                onValueChange={(v) => setNewField({...newField, required: v === 'true'})}
                            >
                                <SelectTrigger className='w-24'>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='true'>Yes</SelectItem>
                                    <SelectItem value='false'>No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setShowFormFieldDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddField}>
                            {editingField ? 'Update Field' : 'Add Field'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Play Limit Dialog */}
            <Dialog open={showPlayLimitDialog} onOpenChange={setShowPlayLimitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure Play Limit</DialogTitle>
                        <DialogDescription>Set how many times users can play</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='flex items-center justify-between p-4 border rounded-lg'>
                            <div>
                                <p className='font-medium'>Enable Play Limit</p>
                                <p className='text-sm text-muted-foreground'>Restrict number of plays</p>
                            </div>
                            <Select
                                value={playLimitEnabled.toString()}
                                onValueChange={(v) => setPlayLimitEnabled(v === 'true')}
                            >
                                <SelectTrigger className='w-32'>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='true'>Enabled</SelectItem>
                                    <SelectItem value='false'>Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {playLimitEnabled && (
                            <div className='space-y-2'>
                                <Label htmlFor='playLimit'>Number of Plays Allowed</Label>
                                <Select
                                    value={playLimitValue.toString()}
                                    onValueChange={(v) => setPlayLimitValue(Number(v))}
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>1 play per user</SelectItem>
                                        <SelectItem value='2'>2 plays per user</SelectItem>
                                        <SelectItem value='3'>3 plays per user</SelectItem>
                                        <SelectItem value='5'>5 plays per user</SelectItem>
                                        <SelectItem value='10'>10 plays per user</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className='text-xs text-muted-foreground'>
                                    Users will be limited to {playLimitValue} {playLimitValue === 1 ? 'play' : 'plays'} during the campaign period
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => {
                            setShowPlayLimitDialog(false)
                            toast.success('Play limit settings updated')
                        }}>
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SMS Notifications Dialog */}
            <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>SMS Notification Settings</DialogTitle>
                        <DialogDescription>Configure SMS notifications for winners</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='flex items-center justify-between p-4 border rounded-lg'>
                            <div>
                                <p className='font-medium'>Enable SMS Notifications</p>
                                <p className='text-sm text-muted-foreground'>Send SMS to winners</p>
                            </div>
                            <Select
                                value={smsEnabled.toString()}
                                onValueChange={(v) => setSmsEnabled(v === 'true')}
                            >
                                <SelectTrigger className='w-32'>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='true'>Enabled</SelectItem>
                                    <SelectItem value='false'>Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {smsEnabled && (
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='smsTemplate'>SMS Message Template</Label>
                                    <Textarea
                                        id='smsTemplate'
                                        rows={4}
                                        placeholder='Congratulations! You won {reward_name}. Use code {reward_code} to redeem.'
                                        defaultValue='Congratulations! You won {reward_name}. Visit us within {expiry_days} days to claim your prize. - {client_name}'
                                    />
                                    <p className='text-xs text-muted-foreground'>
                                        Available variables: {'{reward_name}'}, {'{reward_code}'}, {'{expiry_days}'}, {'{client_name}'}
                                    </p>
                                </div>
                                <div className='p-4 bg-muted/50 rounded-lg border'>
                                    <p className='text-sm'>
                                        <strong>Preview:</strong><br/>
                                        Congratulations! You won Free Pizza. Visit us within 7 days to claim your prize. - Pizza Palace
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setShowSmsDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            setShowSmsDialog(false)
                            toast.success('SMS settings updated')
                        }}>
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reward Expiry Dialog */}
            <Dialog open={showExpiryDialog} onOpenChange={setShowExpiryDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reward Expiry Settings</DialogTitle>
                        <DialogDescription>Configure how long rewards remain valid</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='expiryDays'>Expiry Period</Label>
                            <Select
                                value={rewardExpiryDays.toString()}
                                onValueChange={(v) => setRewardExpiryDays(Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='1'>1 day</SelectItem>
                                    <SelectItem value='3'>3 days</SelectItem>
                                    <SelectItem value='7'>7 days</SelectItem>
                                    <SelectItem value='14'>14 days</SelectItem>
                                    <SelectItem value='30'>30 days</SelectItem>
                                    <SelectItem value='60'>60 days</SelectItem>
                                    <SelectItem value='90'>90 days</SelectItem>
                                    <SelectItem value='0'>Never expires</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className='text-xs text-muted-foreground'>
                                {rewardExpiryDays === 0
                                    ? 'Rewards will never expire'
                                    : `Rewards must be redeemed within ${rewardExpiryDays} ${rewardExpiryDays === 1 ? 'day' : 'days'} of winning`}
                            </p>
                        </div>
                        <div className='p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg'>
                            <p className='text-sm text-amber-900 dark:text-amber-100'>
                                <strong>Note:</strong> Expired rewards cannot be redeemed and will be marked as invalid.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => {
                            setShowExpiryDialog(false)
                            toast.success('Expiry settings updated')
                        }}>
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Campaign Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the campaign and all associated data including scans, rewards, and QR codes. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCampaign}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Campaign
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
