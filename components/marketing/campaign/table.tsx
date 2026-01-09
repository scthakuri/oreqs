'use client'

import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {MoreHorizontal, Loader2} from 'lucide-react'
import type {Campaign} from '@/types/marketing/campaign'
import {format} from 'date-fns'

interface CampaignsTableProps {
    campaigns: Campaign[]
    isLoading: boolean
    onDelete: (id: number) => void
    onSend: (id: number) => void
    onPause: (id: number) => void
    onCancel: (id: number) => void
}

const CampaignsTable = ({
    campaigns,
    isLoading,
    onDelete,
    onSend,
    onPause,
    onCancel
}: CampaignsTableProps) => {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default'
            case 'scheduled':
                return 'secondary'
            case 'sending':
                return 'default'
            case 'failed':
                return 'destructive'
            case 'cancelled':
                return 'outline'
            default:
                return 'outline'
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-8'>
                <Loader2 className='size-6 animate-spin text-muted-foreground'/>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Recipients</TableHead>
                    <TableHead className='text-right'>Opened</TableHead>
                    <TableHead className='text-right'>Clicked</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {campaigns.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                            No campaigns found
                        </TableCell>
                    </TableRow>
                ) : (
                    campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{campaign.name}</span>
                                    {campaign.subject && (
                                        <span className='text-xs text-muted-foreground line-clamp-1'>
                                            {campaign.subject}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(campaign.status)}>
                                    {campaign.status_display}
                                </Badge>
                            </TableCell>
                            <TableCell className='text-right'>
                                {campaign.report?.total_recipients ?
                                    campaign.report.total_recipients.toLocaleString() : '-'}
                            </TableCell>
                            <TableCell className='text-right'>
                                {campaign.report && campaign.report.opened_count > 0 ? (
                                    <div className='flex flex-col items-end'>
                                        <span>{campaign.report.opened_count.toLocaleString()}</span>
                                        <span className='text-xs text-muted-foreground'>
                                            {campaign.report.open_rate.toFixed(1)}%
                                        </span>
                                    </div>
                                ) : '-'}
                            </TableCell>
                            <TableCell className='text-right'>
                                {campaign.report && campaign.report.unique_opens > 0 ? (
                                    <div className='flex flex-col items-end'>
                                        <span>{campaign.report.unique_opens.toLocaleString()}</span>
                                    </div>
                                ) : '-'}
                            </TableCell>
                            <TableCell className='text-sm text-muted-foreground'>
                                {campaign.sent_at ?
                                    format(new Date(campaign.sent_at), 'MMM dd, yyyy HH:mm') :
                                    campaign.scheduled_date ?
                                    format(new Date(campaign.scheduled_date), 'MMM dd, yyyy HH:mm') :
                                    '-'}
                            </TableCell>
                            <TableCell className='text-right'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='icon'>
                                            <MoreHorizontal className='size-4'/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        {campaign.status === 'draft' && (
                                            <DropdownMenuItem onClick={() => onSend(campaign.id)}>
                                                Send Now
                                            </DropdownMenuItem>
                                        )}
                                        {campaign.status === 'sending' && (
                                            <DropdownMenuItem onClick={() => onPause(campaign.id)}>
                                                Pause
                                            </DropdownMenuItem>
                                        )}
                                        {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
                                            <DropdownMenuItem onClick={() => onCancel(campaign.id)}>
                                                Cancel
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            className='text-destructive'
                                            onClick={() => onDelete(campaign.id)}
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
    )
}

export default CampaignsTable