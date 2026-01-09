import {ArrowLeft, Edit, Mail, Phone, Building2, MapPin, DollarSign} from 'lucide-react'
import Link from 'next/link'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {format} from 'date-fns'
import {serverApiGet} from '@/lib/server-api'
import type {Dealer} from '@/types/api'
import {ErrorDisplay} from '@/components/ui/error-display'
import {redirect} from 'next/navigation'
import {DealerClientsTab} from '@/components/dealer/dealer-clients-tab'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function Page({params}: PageProps) {
    const {id} = await params
    let dealer: Dealer | null = null
    let error: string | null = null

    try {
        dealer = await serverApiGet<Dealer>(`/dealers/${id}/`)
    } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
            const axiosError = err as {response?: {status?: number}};
            if (axiosError.response?.status === 401) {
                redirect('/login')
            }
        }
        error = err instanceof Error ? err.message : 'Failed to load dealer data'
    }

    if (error || !dealer) {
        return (
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Link href='/admin/dealers'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Dealer Details</h1>
                    </div>
                </div>
                <ErrorDisplay
                    title='Failed to Load Dealer'
                    message={error || 'Could not retrieve dealer information'}
                    showBack
                    backUrl='/dealers'
                    backLabel='Back to Dealers'
                    showRefresh
                />
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href='/admin/dealers'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4'/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{dealer.user.full_name}</h1>
                        <p className='text-muted-foreground'>{dealer.company_data?.name || 'No company'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Link href={`/admin/dealers/${id}/edit`}>
                        <Button>
                            <Edit className='mr-2 size-4'/>
                            Edit Dealer
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.clients_count}</div>
                        <p className='text-xs text-muted-foreground'>Clients registered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dealer.campaigns_count}</div>
                        <p className='text-xs text-muted-foreground'>Campaigns created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Subscription Plan</CardTitle>
                        <DollarSign className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold capitalize'>{dealer.subscription_plan}</div>
                        <p className='text-xs text-muted-foreground'>
                            Ends {format(new Date(dealer.subscription_end), 'MMM dd, yyyy')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Member Since</CardTitle>
                        <Building2 className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{format(new Date(dealer.created_at), 'MMM yyyy')}</div>
                        <p className='text-xs text-muted-foreground'>
                            {format(new Date(dealer.created_at), 'MMM dd, yyyy')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Details Section */}
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <DealerClientsTab dealerId={dealer.id}/>
                </div>

                <div className='lg:col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <Mail className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Email</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.user.email}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Phone className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Phone</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <Building2 className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Company</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.company_data?.name || 'No company'}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className='flex items-start gap-3'>
                                <MapPin className='size-4 mt-0.5 text-muted-foreground'/>
                                <div>
                                    <p className='text-sm font-medium'>Country</p>
                                    <p className='text-sm text-muted-foreground'>{dealer.country_data.name}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Subscription Period</p>
                                <p className='text-sm text-muted-foreground'>
                                    {format(new Date(dealer.subscription_start), 'MMM dd, yyyy')} - {format(new Date(dealer.subscription_end), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className='text-sm font-medium'>Member Since</p>
                                <p className='text-sm text-muted-foreground'>{format(new Date(dealer.created_at), 'MMMM dd, yyyy')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
