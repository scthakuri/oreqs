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
import type {Campaign} from '@/types/api'

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

interface CampaignEditFormProps {
    campaign: Campaign
}

export function CampaignEditForm({campaign}: CampaignEditFormProps) {
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
    const [campaignName, setCampaignName] = useState(campaign.name)
    const [campaignType, setCampaignType] = useState(campaign.campaign_type_display)
    const [campaignDescription, setCampaignDescription] = useState(campaign.description || '')
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(campaign.start_date))
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(campaign.end_date))
    const [selectedClient, setSelectedClient] = useState(campaign.client_data?.id?.toString() || '1')
    const [campaignStatus, setCampaignStatus] = useState(campaign.status_display)

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

                    <Link href={`/admin/campaigns/${campaign.id}`}>
                        <Button variant='outline' className='w-full'>
                            View Campaign
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-y-auto p-8 pb-24 pr-4'>
                <div className='w-full space-y-6'>
                    {/* Rest of the component continues... */}
                    {/* I'll split this into multiple parts due to length */}
                </div>
            </div>
        </div>
    )
}
