'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Switch} from '@/components/ui/switch'
import {Separator} from '@/components/ui/separator'
import {toast} from 'sonner'
import {Bell} from 'lucide-react'

const Page = () => {
    const [notifications, setNotifications] = useState({
        // Email Notifications
        emailCampaigns: true,
        emailRewards: true,
        emailClients: true,
        emailSecurity: true,
        emailWeekly: true,
        emailMonthly: false,

        // Push Notifications
        pushCampaigns: true,
        pushRewards: false,
        pushClients: true,
        pushSecurity: true,

        // SMS Notifications
        smsSecurity: true,
        smsImportant: false,
    })

    const handleToggle = (key: string, value: boolean) => {
        setNotifications(prev => ({...prev, [key]: value}))
    }

    const handleSave = () => {
        toast.success('Notification preferences saved!', {
            description: 'Your notification settings have been updated.'
        })
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Bell className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Notification Settings</h1>
                    <p className='text-muted-foreground'>Manage how you receive notifications and updates</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Receive notifications via email</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailCampaigns'>Campaign Updates</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Get notified when campaigns start, end, or require attention
                                    </p>
                                </div>
                                <Switch
                                    id='emailCampaigns'
                                    checked={notifications.emailCampaigns}
                                    onCheckedChange={(checked) => handleToggle('emailCampaigns', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailRewards'>Reward Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Notifications about reward redemptions and low inventory
                                    </p>
                                </div>
                                <Switch
                                    id='emailRewards'
                                    checked={notifications.emailRewards}
                                    onCheckedChange={(checked) => handleToggle('emailRewards', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailClients'>Client Activity</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Updates about new clients, subscriptions, and account changes
                                    </p>
                                </div>
                                <Switch
                                    id='emailClients'
                                    checked={notifications.emailClients}
                                    onCheckedChange={(checked) => handleToggle('emailClients', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailSecurity'>Security Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Important security notifications and login alerts
                                    </p>
                                </div>
                                <Switch
                                    id='emailSecurity'
                                    checked={notifications.emailSecurity}
                                    onCheckedChange={(checked) => handleToggle('emailSecurity', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailWeekly'>Weekly Summary</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Receive a weekly summary of platform activity
                                    </p>
                                </div>
                                <Switch
                                    id='emailWeekly'
                                    checked={notifications.emailWeekly}
                                    onCheckedChange={(checked) => handleToggle('emailWeekly', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='emailMonthly'>Monthly Report</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Get a monthly analytics and performance report
                                    </p>
                                </div>
                                <Switch
                                    id='emailMonthly'
                                    checked={notifications.emailMonthly}
                                    onCheckedChange={(checked) => handleToggle('emailMonthly', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Push Notifications</CardTitle>
                            <CardDescription>Receive browser and mobile push notifications</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='pushCampaigns'>Campaign Updates</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Real-time push notifications for campaign events
                                    </p>
                                </div>
                                <Switch
                                    id='pushCampaigns'
                                    checked={notifications.pushCampaigns}
                                    onCheckedChange={(checked) => handleToggle('pushCampaigns', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='pushRewards'>Reward Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Instant alerts for reward-related activities
                                    </p>
                                </div>
                                <Switch
                                    id='pushRewards'
                                    checked={notifications.pushRewards}
                                    onCheckedChange={(checked) => handleToggle('pushRewards', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='pushClients'>Client Activity</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Push notifications for client updates
                                    </p>
                                </div>
                                <Switch
                                    id='pushClients'
                                    checked={notifications.pushClients}
                                    onCheckedChange={(checked) => handleToggle('pushClients', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='pushSecurity'>Security Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Critical security push notifications
                                    </p>
                                </div>
                                <Switch
                                    id='pushSecurity'
                                    checked={notifications.pushSecurity}
                                    onCheckedChange={(checked) => handleToggle('pushSecurity', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SMS Notifications</CardTitle>
                            <CardDescription>Receive important alerts via SMS</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='smsSecurity'>Security Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Critical security alerts sent via SMS
                                    </p>
                                </div>
                                <Switch
                                    id='smsSecurity'
                                    checked={notifications.smsSecurity}
                                    onCheckedChange={(checked) => handleToggle('smsSecurity', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label htmlFor='smsImportant'>Important Updates</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Receive critical platform updates via SMS
                                    </p>
                                </div>
                                <Switch
                                    id='smsImportant'
                                    checked={notifications.smsImportant}
                                    onCheckedChange={(checked) => handleToggle('smsImportant', checked)}
                                />
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
                                Save Preferences
                            </Button>
                            <Button variant='outline' className='w-full' onClick={() => {
                                toast.info('Enabling all notifications')
                                setNotifications({
                                    emailCampaigns: true,
                                    emailRewards: true,
                                    emailClients: true,
                                    emailSecurity: true,
                                    emailWeekly: true,
                                    emailMonthly: true,
                                    pushCampaigns: true,
                                    pushRewards: true,
                                    pushClients: true,
                                    pushSecurity: true,
                                    smsSecurity: true,
                                    smsImportant: true,
                                })
                            }}>
                                Enable All
                            </Button>
                            <Button variant='outline' className='w-full' onClick={() => {
                                toast.info('Disabling all non-critical notifications')
                                setNotifications({
                                    emailCampaigns: false,
                                    emailRewards: false,
                                    emailClients: false,
                                    emailSecurity: true,
                                    emailWeekly: false,
                                    emailMonthly: false,
                                    pushCampaigns: false,
                                    pushRewards: false,
                                    pushClients: false,
                                    pushSecurity: true,
                                    smsSecurity: true,
                                    smsImportant: false,
                                })
                            }}>
                                Critical Only
                            </Button>
                            <Separator/>
                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p>• Security alerts are recommended</p>
                                <p>• SMS notifications may incur charges</p>
                                <p>• Changes take effect immediately</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
