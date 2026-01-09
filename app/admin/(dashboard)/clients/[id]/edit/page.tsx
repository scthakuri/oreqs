import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {ClientForm} from '@/components/forms/client-form'
import type {Client} from '@/types/api'
import {redirect} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import {ErrorDisplay} from '@/components/ui/error-display'

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
                        <h1 className='text-3xl font-bold tracking-tight'>Edit Client</h1>
                    </div>
                </div>
                <ErrorDisplay
                    title='Failed to Load Client'
                    message={error || 'Could not retrieve client information'}
                    showBack
                    backUrl='/clients'
                    backLabel='Back to Clients'
                    showRefresh
                />
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/clients'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Client</h1>
                    <p className='text-muted-foreground'>Update client information</p>
                </div>
            </div>

            <ClientForm client={client} mode='edit' />
        </div>
    )
}
