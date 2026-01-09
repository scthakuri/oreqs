'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bell, Loader2 } from 'lucide-react';

type NotificationSettings = {
  // Email Notifications
  emailCampaigns: boolean;
  emailRewards: boolean;
  emailClients: boolean;
  emailSecurity: boolean;
  emailWeekly: boolean;
  emailMonthly: boolean;

  // Push Notifications
  pushCampaigns: boolean;
  pushRewards: boolean;
  pushClients: boolean;
  pushSecurity: boolean;

  // SMS Notifications
  smsSecurity: boolean;
  smsImportant: boolean;
};

const defaultSettings: NotificationSettings = {
  emailCampaigns: true,
  emailRewards: true,
  emailClients: true,
  emailSecurity: true,
  emailWeekly: true,
  emailMonthly: false,
  pushCampaigns: true,
  pushRewards: false,
  pushClients: true,
  pushSecurity: true,
  smsSecurity: true,
  smsImportant: false,
};

const Page = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Save to localStorage
    localStorage.setItem('notification_settings', JSON.stringify(notifications));

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      toast.success('Notification preferences saved!', {
        description: 'Your notification settings have been updated.',
      });
    }, 500);
  };

  const handleReset = () => {
    setNotifications(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
          <Bell className='size-5 text-primary' />
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

              <Separator />

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

              <Separator />

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

              <Separator />

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

              <Separator />

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

              <Separator />

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
              <CardDescription>Receive in-app push notifications</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='pushCampaigns'>Campaign Updates</Label>
                  <p className='text-sm text-muted-foreground'>
                    Real-time campaign notifications in the app
                  </p>
                </div>
                <Switch
                  id='pushCampaigns'
                  checked={notifications.pushCampaigns}
                  onCheckedChange={(checked) => handleToggle('pushCampaigns', checked)}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='pushRewards'>Reward Alerts</Label>
                  <p className='text-sm text-muted-foreground'>
                    Push notifications for reward-related events
                  </p>
                </div>
                <Switch
                  id='pushRewards'
                  checked={notifications.pushRewards}
                  onCheckedChange={(checked) => handleToggle('pushRewards', checked)}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='pushClients'>Client Activity</Label>
                  <p className='text-sm text-muted-foreground'>
                    Notifications about client account updates
                  </p>
                </div>
                <Switch
                  id='pushClients'
                  checked={notifications.pushClients}
                  onCheckedChange={(checked) => handleToggle('pushClients', checked)}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='pushSecurity'>Security Alerts</Label>
                  <p className='text-sm text-muted-foreground'>
                    Important security push notifications
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
              <CardDescription>Receive important updates via SMS</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='smsSecurity'>Security Alerts</Label>
                  <p className='text-sm text-muted-foreground'>
                    Critical security notifications sent to your phone
                  </p>
                </div>
                <Switch
                  id='smsSecurity'
                  checked={notifications.smsSecurity}
                  onCheckedChange={(checked) => handleToggle('smsSecurity', checked)}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='smsImportant'>Important Updates</Label>
                  <p className='text-sm text-muted-foreground'>
                    Time-sensitive notifications via SMS
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
              <Button className='w-full' onClick={handleSave} disabled={!hasChanges || isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                Save Preferences
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset to Default
              </Button>
              <Separator />
              <div className='space-y-2 text-sm text-muted-foreground'>
                <p>• Changes are saved when you click Save</p>
                <p>• Settings are stored locally in your browser</p>
                <p>• Security alerts are always recommended</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
