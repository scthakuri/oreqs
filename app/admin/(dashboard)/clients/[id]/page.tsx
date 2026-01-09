import {
    ArrowLeft,
    Building2,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Store,
    Megaphone,
    TrendingUp,
    Users,
    Edit,
} from 'lucide-react'
import Link from 'next/link'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {format} from 'date-fns'
import {serverApiGet} from '@/lib/server-api'
import type {Client} from '@/types/api'
import {ErrorDisplay} from '@/components/ui/error-display'
import {redirect} from 'next/navigation'
import {ClientBranchesTab} from '@/components/client/client-branches-tab'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function Page({params}: PageProps) {
    const {id} = await params
    let client: Client | null = null
    let error: string | null = null

    try {
        client = await serverApiGet<Client>(`/clients/${id}/`)
    } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
            const axiosError = err as {response?: {status?: number}};
            if (axiosError.response?.status === 401) {
                redirect('/login')
            }
        }
        error = err instanceof Error ? err.message : 'Failed to load client data'
    }

    if (error || !client) {
        return (
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Link href='/admin/clients'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Client Details</h1>
                    </div>
                </div>
                <ErrorDisplay
                    title='Failed to Load Client'
                    message={error || 'Could not retrieve client information'}
                    showBack
                    backUrl='/admin/clients'
                    backLabel='Back to Clients'
                    showRefresh
                />
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href='/admin/clients'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{client.user.full_name}</h1>
                        <p className='text-muted-foreground'>{client.company_data?.name || 'No company'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Link href={`/admin/clients/${id}/edit`}>
                        <Button>
                            <Edit className='mr-2 size-4'/>
                            Edit Client
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Branches</CardTitle>
                        <Store className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{client.branches_count}</div>
                        <p className='text-xs text-muted-foreground'>Branches registered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Megaphone className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{client.campaigns_count}</div>
                        <p className='text-xs text-muted-foreground'>Campaigns created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Subscription Plan</CardTitle>
                        <TrendingUp className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold capitalize'>{client.subscription_plan}</div>
                        <p className='text-xs text-muted-foreground'>
                            {client.subscription_end ? `Ends ${format(new Date(client.subscription_end), 'MMM dd, yyyy')}` : 'Lifetime'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Member Since</CardTitle>
                        <Calendar className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{format(new Date(client.created_at), 'MMM yyyy')}</div>
                        <p className='text-xs text-muted-foreground'>
                            {format(new Date(client.created_at), 'MMM dd, yyyy')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <ClientBranchesTab clientId={client.id}/>
                </div>

                <div className='lg:col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <Mail className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Email</p>
                                    <p className='text-sm text-muted-foreground'>{client.user.email}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Phone className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Phone</p>
                                    <p className='text-sm text-muted-foreground'>{client.user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Building2 className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Company</p>
                                    <p className='text-sm text-muted-foreground'>{client.company_data?.name || 'No company'}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Users className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Dealer</p>
                                    <p className='text-sm text-muted-foreground'>
                                        <Link href={`/admin/dealers/${client.dealer}`} className='hover:underline'>
                                            {client.dealer_data.user.full_name}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <MapPin className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Country</p>
                                    <p className='text-sm text-muted-foreground'>{client.country_data.name}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Subscription Period</p>
                                <p className='text-sm text-muted-foreground'>
                                    {format(new Date(client.subscription_start), 'MMM dd, yyyy')}
                                    {client.subscription_end ? ` - ${format(new Date(client.subscription_end), 'MMM dd, yyyy')}` : ' - Lifetime'}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Member Since</p>
                                <p className='text-sm text-muted-foreground'>{format(new Date(client.created_at), 'MMMM dd, yyyy')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
