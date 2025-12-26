'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Badge} from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MessageSquare,
    Plus,
    Search,
    MoreHorizontal,
    Send,
    Users,
    TrendingUp,
    CreditCard,
    FileText,
    Calendar,
    Copy,
} from 'lucide-react'
import {toast} from 'sonner'

const campaignsData = [
    {
        id: 1,
        name: 'Summer Sale Announcement',
        message: 'Get 50% off on all items! Visit us today. Use code: SUMMER50',
        status: 'Sent',
        recipients: 1250,
        delivered: 1240,
        failed: 10,
        clicks: 340,
        credits: 1250,
        sentDate: '2024-06-20 10:30 AM',
        client: 'Pizza Palace',
    },
    {
        id: 2,
        name: 'Weekend Special Promo',
        message: 'Weekend special! Buy 1 Get 1 Free. Limited time offer!',
        status: 'Scheduled',
        recipients: 890,
        delivered: 0,
        failed: 0,
        clicks: 0,
        credits: 890,
        sentDate: '2024-06-25 09:00 AM',
        client: 'Burger King',
    },
    {
        id: 3,
        name: 'New Product Launch',
        message: 'Introducing our new menu! Come try it today and get 20% off.',
        status: 'Draft',
        recipients: 0,
        delivered: 0,
        failed: 0,
        clicks: 0,
        credits: 0,
        sentDate: '-',
        client: 'Starbucks Nepal',
    },
]

const templatesData = [
    {id: 1, name: 'Sale Announcement', message: 'Get {discount}% off on {product}! Use code: {code}', category: 'Promotional'},
    {id: 2, name: 'Event Reminder', message: 'Don\'t forget! {event} starts on {date}. See you there!', category: 'Reminder'},
    {id: 3, name: 'Thank You', message: 'Thank you for your purchase! We appreciate your business.', category: 'Transactional'},
]

const Page = () => {
    const [activeTab, setActiveTab] = useState('campaigns')
    const [searchQuery, setSearchQuery] = useState('')
    const [showNewCampaign, setShowNewCampaign] = useState(false)
    const [showNewTemplate, setShowNewTemplate] = useState(false)

    const [campaignForm, setCampaignForm] = useState({
        name: '',
        message: '',
        recipients: 'all',
        client: '',
        scheduledDate: '',
    })

    const [templateForm, setTemplateForm] = useState({
        name: '',
        message: '',
        category: 'promotional',
    })

    const filteredCampaigns = campaignsData.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.client.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalSent = campaignsData.reduce((sum, c) => sum + c.delivered, 0)
    const totalClicks = campaignsData.reduce((sum, c) => sum + c.clicks, 0)
    const creditsUsed = campaignsData.reduce((sum, c) => sum + c.credits, 0)

    const handleCreateCampaign = () => {
        if (!campaignForm.name.trim()) {
            toast.error('Campaign name is required')
            return
        }
        if (!campaignForm.message.trim()) {
            toast.error('Message is required')
            return
        }
        if (campaignForm.message.length > 160) {
            toast.error('Message must be 160 characters or less')
            return
        }

        toast.success('SMS Campaign created!', {
            description: `${campaignForm.name} has been scheduled.`
        })
        setShowNewCampaign(false)
        setCampaignForm({name: '', message: '', recipients: 'all', client: '', scheduledDate: ''})
    }

    const handleCreateTemplate = () => {
        if (!templateForm.name.trim()) {
            toast.error('Template name is required')
            return
        }
        if (!templateForm.message.trim()) {
            toast.error('Message is required')
            return
        }

        toast.success('Template created successfully!')
        setShowNewTemplate(false)
        setTemplateForm({name: '', message: '', category: 'promotional'})
    }

    const handleCampaignAction = (action: string, campaignName: string) => {
        switch (action) {
            case 'view':
                toast.info(`Viewing ${campaignName}`)
                break
            case 'duplicate':
                toast.success(`${campaignName} duplicated`)
                break
            case 'report':
                toast.info(`Generating report for ${campaignName}`)
                break
            case 'delete':
                toast.error(`${campaignName} deleted`)
                break
        }
    }

    const messageLength = campaignForm.message.length
    const messagesRequired = Math.ceil(messageLength / 160)

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <MessageSquare className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>SMS Marketing</h1>
                    <p className='text-muted-foreground'>Create and manage SMS campaigns for your clients</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <MessageSquare className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{campaignsData.length}</div>
                        <p className='text-xs text-muted-foreground'>All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Messages Sent</CardTitle>
                        <Send className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalSent.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Click Rate</CardTitle>
                        <TrendingUp className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : 0}%
                        </div>
                        <p className='text-xs text-muted-foreground'>{totalClicks.toLocaleString()} total clicks</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Credits Used</CardTitle>
                        <CreditCard className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{creditsUsed.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>15,230 remaining</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value='campaigns'>Campaigns</TabsTrigger>
                    <TabsTrigger value='templates'>Templates</TabsTrigger>
                </TabsList>

                {/* Campaigns Tab */}
                <TabsContent value='campaigns' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>SMS Campaigns</CardTitle>
                                    <CardDescription>Manage your SMS marketing campaigns</CardDescription>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='relative'>
                                        <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                        <Input
                                            placeholder='Search campaigns...'
                                            className='pl-8 w-[250px]'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className='mr-2 size-4'/>
                                                New Campaign
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className='sm:max-w-[600px]'>
                                            <DialogHeader>
                                                <DialogTitle>Create SMS Campaign</DialogTitle>
                                                <DialogDescription>
                                                    Send SMS messages to your customers
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className='space-y-4 py-4'>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='campaignName'>Campaign Name *</Label>
                                                    <Input
                                                        id='campaignName'
                                                        placeholder='Summer Sale SMS'
                                                        value={campaignForm.name}
                                                        onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                                                    />
                                                </div>

                                                <div className='space-y-2'>
                                                    <Label htmlFor='template'>Use Template (Optional)</Label>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const template = templatesData.find(t => t.id.toString() === value)
                                                            if (template) {
                                                                setCampaignForm({...campaignForm, message: template.message})
                                                                toast.success('Template loaded')
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select a template'/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {templatesData.map((template) => (
                                                                <SelectItem key={template.id} value={template.id.toString()}>
                                                                    <div className='flex items-center gap-2'>
                                                                        <FileText className='size-4'/>
                                                                        <span>{template.name}</span>
                                                                        <Badge variant='outline' className='text-xs'>
                                                                            {template.category}
                                                                        </Badge>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Load a pre-made template or write your own message
                                                    </p>
                                                </div>

                                                <div className='space-y-2'>
                                                    <Label htmlFor='message'>Message *</Label>
                                                    <Textarea
                                                        id='message'
                                                        placeholder='Your SMS message here...'
                                                        value={campaignForm.message}
                                                        onChange={(e) => setCampaignForm({...campaignForm, message: e.target.value})}
                                                        rows={4}
                                                    />
                                                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                                        <span>{messageLength}/160 characters</span>
                                                        <span>{messagesRequired} SMS {messagesRequired > 1 ? 'messages' : 'message'}</span>
                                                    </div>
                                                </div>

                                                <div className='grid gap-4 md:grid-cols-2'>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='client'>Client</Label>
                                                        <Select
                                                            value={campaignForm.client}
                                                            onValueChange={(value) => setCampaignForm({...campaignForm, client: value})}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select client'/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='pizza-palace'>Pizza Palace</SelectItem>
                                                                <SelectItem value='burger-king'>Burger King</SelectItem>
                                                                <SelectItem value='starbucks'>Starbucks Nepal</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='recipients'>Recipients</Label>
                                                        <Select
                                                            value={campaignForm.recipients}
                                                            onValueChange={(value) => setCampaignForm({...campaignForm, recipients: value})}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='all'>All Customers</SelectItem>
                                                                <SelectItem value='active'>Active Users</SelectItem>
                                                                <SelectItem value='winners'>Winners Only</SelectItem>
                                                                <SelectItem value='custom'>Custom List</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className='space-y-2'>
                                                    <Label htmlFor='schedule'>Schedule (Optional)</Label>
                                                    <Input
                                                        id='schedule'
                                                        type='datetime-local'
                                                        value={campaignForm.scheduledDate}
                                                        onChange={(e) => setCampaignForm({...campaignForm, scheduledDate: e.target.value})}
                                                    />
                                                    <p className='text-xs text-muted-foreground'>
                                                        Leave empty to send immediately
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex justify-end gap-2'>
                                                <Button variant='outline' onClick={() => setShowNewCampaign(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleCreateCampaign}>
                                                    <Send className='mr-2 size-4'/>
                                                    {campaignForm.scheduledDate ? 'Schedule Campaign' : 'Send Now'}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='text-right'>Recipients</TableHead>
                                        <TableHead className='text-right'>Delivered</TableHead>
                                        <TableHead className='text-right'>Clicks</TableHead>
                                        <TableHead>Sent Date</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCampaigns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                                                No campaigns found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{campaign.name}</span>
                                                        <span className='text-xs text-muted-foreground line-clamp-1'>
                                                            {campaign.message}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='text-sm'>{campaign.client}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        campaign.status === 'Sent' ? 'default' :
                                                        campaign.status === 'Scheduled' ? 'secondary' : 'outline'
                                                    }>
                                                        {campaign.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>{campaign.recipients.toLocaleString()}</TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.delivered > 0 ? (
                                                        <div className='flex flex-col items-end'>
                                                            <span>{campaign.delivered.toLocaleString()}</span>
                                                            {campaign.failed > 0 && (
                                                                <span className='text-xs text-destructive'>
                                                                    {campaign.failed} failed
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {campaign.clicks > 0 ? campaign.clicks.toLocaleString() : '-'}
                                                </TableCell>
                                                <TableCell className='text-sm text-muted-foreground'>
                                                    {campaign.sentDate}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant='ghost' size='icon'>
                                                                <MoreHorizontal className='size-4'/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align='end'>
                                                            <DropdownMenuItem onClick={() => handleCampaignAction('view', campaign.name)}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleCampaignAction('duplicate', campaign.name)}>
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleCampaignAction('report', campaign.name)}>
                                                                View Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleCampaignAction('delete', campaign.name)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value='templates' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>SMS Templates</CardTitle>
                                    <CardDescription>Reusable message templates for quick campaigns</CardDescription>
                                </div>
                                <Dialog open={showNewTemplate} onOpenChange={setShowNewTemplate}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className='mr-2 size-4'/>
                                            New Template
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create Template</DialogTitle>
                                            <DialogDescription>
                                                Create a reusable SMS template
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='space-y-4 py-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='templateName'>Template Name *</Label>
                                                <Input
                                                    id='templateName'
                                                    placeholder='Sale Announcement'
                                                    value={templateForm.name}
                                                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                                                />
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='category'>Category</Label>
                                                <Select
                                                    value={templateForm.category}
                                                    onValueChange={(value) => setTemplateForm({...templateForm, category: value})}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='promotional'>Promotional</SelectItem>
                                                        <SelectItem value='transactional'>Transactional</SelectItem>
                                                        <SelectItem value='reminder'>Reminder</SelectItem>
                                                        <SelectItem value='announcement'>Announcement</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='templateMessage'>Message *</Label>
                                                <Textarea
                                                    id='templateMessage'
                                                    placeholder='Use {variables} for dynamic content'
                                                    value={templateForm.message}
                                                    onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                                                    rows={4}
                                                />
                                                <p className='text-xs text-muted-foreground'>
                                                    Use {'{'}discount{'}'}, {'{'}code{'}'}, {'{'}name{'}'} for dynamic values
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex justify-end gap-2'>
                                            <Button variant='outline' onClick={() => setShowNewTemplate(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleCreateTemplate}>
                                                Create Template
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {templatesData.map((template) => (
                                    <Card key={template.id} className='hover:shadow-md transition-shadow'>
                                        <CardHeader className='pb-3'>
                                            <div className='flex items-start justify-between'>
                                                <div className='flex-1'>
                                                    <CardTitle className='text-base'>{template.name}</CardTitle>
                                                    <Badge variant='outline' className='mt-2 text-xs'>
                                                        {template.category}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => {
                                                        setCampaignForm({...campaignForm, message: template.message})
                                                        setShowNewCampaign(true)
                                                        toast.success('Template loaded')
                                                    }}
                                                >
                                                    <Copy className='size-4'/>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className='text-sm text-muted-foreground line-clamp-3'>
                                                {template.message}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page