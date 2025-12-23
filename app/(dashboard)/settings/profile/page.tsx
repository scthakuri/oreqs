'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Separator} from '@/components/ui/separator'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {toast} from 'sonner'
import {UserCog, Upload, X} from 'lucide-react'

const Page = () => {
    const [formData, setFormData] = useState({
        fullName: 'Super Admin',
        email: 'admin@oreqs.com',
        phone: '+1 234 567 8900',
        company: 'OREQS Platform',
        role: 'Super Administrator',
        bio: 'Managing QR-based scratch & reward campaigns across multiple countries.',
        timezone: 'UTC-5 (Eastern Time)',
        language: 'English',
        avatar: '',
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const handleSave = () => {
        if (!formData.fullName.trim()) {
            toast.error('Full name is required')
            return
        }
        if (!formData.email.trim()) {
            toast.error('Email is required')
            return
        }

        toast.success('Profile updated successfully!', {
            description: 'Your profile information has been saved.'
        })
    }

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                handleInputChange('avatar', reader.result as string)
                toast.success('Avatar uploaded successfully')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveAvatar = () => {
        handleInputChange('avatar', '')
        toast.success('Avatar removed')
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <UserCog className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Profile Settings</h1>
                    <p className='text-muted-foreground'>Manage your personal information and preferences</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and contact information</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center gap-6'>
                                <Avatar className='size-24'>
                                    <AvatarImage src={formData.avatar}/>
                                    <AvatarFallback className='text-2xl'>
                                        {formData.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1 space-y-2'>
                                    <Label>Profile Picture</Label>
                                    <div className='flex items-center gap-2'>
                                        {formData.avatar ? (
                                            <Button
                                                variant='destructive'
                                                size='sm'
                                                onClick={handleRemoveAvatar}
                                            >
                                                <X className='mr-2 size-4'/>
                                                Remove
                                            </Button>
                                        ) : (
                                            <div className='relative'>
                                                <input
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={handleAvatarUpload}
                                                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                />
                                                <Button variant='outline' size='sm'>
                                                    <Upload className='mr-2 size-4'/>
                                                    Upload
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>

                            <Separator/>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='fullName'>Full Name *</Label>
                                    <Input
                                        id='fullName'
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email Address *</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='phone'>Phone Number</Label>
                                    <Input
                                        id='phone'
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='company'>Company</Label>
                                    <Input
                                        id='company'
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='role'>Role</Label>
                                <Input
                                    id='role'
                                    value={formData.role}
                                    disabled
                                    className='bg-muted'
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Contact support to change your role
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='bio'>Bio</Label>
                                <Textarea
                                    id='bio'
                                    placeholder='Tell us about yourself...'
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Brief description for your profile. Max 200 characters.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Configure your language and timezone</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='timezone'>Timezone</Label>
                                    <Input
                                        id='timezone'
                                        value={formData.timezone}
                                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='language'>Language</Label>
                                    <Input
                                        id='language'
                                        value={formData.language}
                                        onChange={(e) => handleInputChange('language', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='lg:col-span-1'>
                    <Card className='sticky top-4'>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Button className='w-full' onClick={handleSave}>
                                Save Changes
                            </Button>
                            <Button variant='outline' className='w-full' onClick={() => {
                                toast.info('Changes discarded')
                            }}>
                                Cancel
                            </Button>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• Changes are saved immediately</p>
                                <p>• Profile picture must be under 2MB</p>
                                <p>• Email changes require verification</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
