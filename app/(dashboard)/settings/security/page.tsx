'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Switch} from '@/components/ui/switch'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
import {toast} from 'sonner'
import {Shield, Key, Smartphone, Globe, AlertTriangle} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const recentSessions = [
    {
        id: 1,
        device: 'Chrome on MacOS',
        location: 'New York, US',
        ip: '192.168.1.1',
        lastActive: '2 minutes ago',
        current: true,
    },
    {
        id: 2,
        device: 'Safari on iPhone',
        location: 'New York, US',
        ip: '192.168.1.2',
        lastActive: '1 hour ago',
        current: false,
    },
    {
        id: 3,
        device: 'Firefox on Windows',
        location: 'Los Angeles, US',
        ip: '192.168.1.3',
        lastActive: '2 days ago',
        current: false,
    },
]

const Page = () => {
    const [security, setSecurity] = useState({
        twoFactorEnabled: true,
        loginAlerts: true,
        sessionTimeout: true,
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleSecurityToggle = (key: string, value: boolean) => {
        setSecurity(prev => ({...prev, [key]: value}))
        toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`)
    }

    const handlePasswordChange = () => {
        if (!passwordData.currentPassword) {
            toast.error('Current password is required')
            return
        }
        if (!passwordData.newPassword) {
            toast.error('New password is required')
            return
        }
        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        toast.success('Password updated successfully!', {
            description: 'Your password has been changed.'
        })

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
    }

    const handleRevokeSession = (id: number) => {
        toast.success('Session revoked successfully')
    }

    const handleRevokeAllSessions = () => {
        toast.warning('All other sessions have been revoked', {
            description: 'You will need to log in again on those devices.'
        })
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Shield className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Security Settings</h1>
                    <p className='text-muted-foreground'>Manage your account security and privacy</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <Key className='size-5'/>
                                <div>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='currentPassword'>Current Password</Label>
                                <Input
                                    id='currentPassword'
                                    type='password'
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='newPassword'>New Password</Label>
                                <Input
                                    id='newPassword'
                                    type='password'
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Must be at least 8 characters with uppercase, lowercase, and numbers
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                                <Input
                                    id='confirmPassword'
                                    type='password'
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                                />
                            </div>

                            <Button onClick={handlePasswordChange}>
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <Smartphone className='size-5'/>
                                <div>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <div className='flex items-center gap-2'>
                                        <Label>Enable 2FA</Label>
                                        {security.twoFactorEnabled && (
                                            <Badge variant='default' className='text-xs'>Active</Badge>
                                        )}
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        Require a verification code in addition to your password
                                    </p>
                                </div>
                                <Switch
                                    checked={security.twoFactorEnabled}
                                    onCheckedChange={(checked) => handleSecurityToggle('twoFactorEnabled', checked)}
                                />
                            </div>

                            {security.twoFactorEnabled && (
                                <>
                                    <Separator/>
                                    <div className='space-y-2'>
                                        <p className='text-sm font-medium'>Authenticator App</p>
                                        <p className='text-sm text-muted-foreground'>
                                            Use an authenticator app like Google Authenticator or Authy
                                        </p>
                                        <Button variant='outline' size='sm'>
                                            Configure App
                                        </Button>
                                    </div>
                                    <div className='space-y-2'>
                                        <p className='text-sm font-medium'>Backup Codes</p>
                                        <p className='text-sm text-muted-foreground'>
                                            Generate backup codes in case you lose access to your device
                                        </p>
                                        <Button variant='outline' size='sm'>
                                            Generate Codes
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <Globe className='size-5'/>
                                <div>
                                    <CardTitle>Active Sessions</CardTitle>
                                    <CardDescription>Manage your active sessions across devices</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Device</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentSessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium'>{session.device}</span>
                                                    {session.current && (
                                                        <Badge variant='secondary' className='text-xs'>Current</Badge>
                                                    )}
                                                </div>
                                                <p className='text-xs text-muted-foreground'>{session.ip}</p>
                                            </TableCell>
                                            <TableCell className='text-sm'>{session.location}</TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>{session.lastActive}</TableCell>
                                            <TableCell className='text-right'>
                                                {!session.current && (
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => handleRevokeSession(session.id)}
                                                    >
                                                        Revoke
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className='flex justify-end'>
                                <Button variant='destructive' size='sm' onClick={handleRevokeAllSessions}>
                                    Revoke All Other Sessions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <AlertTriangle className='size-5'/>
                                <div>
                                    <CardTitle>Security Preferences</CardTitle>
                                    <CardDescription>Additional security settings</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label>Login Alerts</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Get notified when someone logs into your account
                                    </p>
                                </div>
                                <Switch
                                    checked={security.loginAlerts}
                                    onCheckedChange={(checked) => handleSecurityToggle('loginAlerts', checked)}
                                />
                            </div>

                            <Separator/>

                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label>Session Timeout</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        Automatically log out after 30 minutes of inactivity
                                    </p>
                                </div>
                                <Switch
                                    checked={security.sessionTimeout}
                                    onCheckedChange={(checked) => handleSecurityToggle('sessionTimeout', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='lg:col-span-1'>
                    <Card className='sticky top-4'>
                        <CardHeader>
                            <CardTitle>Security Status</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span>Password Strength</span>
                                    <Badge variant='default'>Strong</Badge>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span>Two-Factor Auth</span>
                                    <Badge variant={security.twoFactorEnabled ? 'default' : 'destructive'}>
                                        {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span>Login Alerts</span>
                                    <Badge variant={security.loginAlerts ? 'default' : 'secondary'}>
                                        {security.loginAlerts ? 'On' : 'Off'}
                                    </Badge>
                                </div>
                            </div>

                            <Separator/>

                            <div className='space-y-2 text-sm text-muted-foreground'>
                                <p className='font-medium text-foreground'>Security Tips:</p>
                                <p>• Use a unique, strong password</p>
                                <p>• Enable two-factor authentication</p>
                                <p>• Review active sessions regularly</p>
                                <p>• Never share your password</p>
                                <p>• Keep backup codes in a safe place</p>
                            </div>

                            <Separator/>

                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>Last Password Change</p>
                                <p className='text-sm text-muted-foreground'>45 days ago</p>
                            </div>

                            <Button variant='outline' className='w-full'>
                                View Security Log
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page
