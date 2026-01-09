import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {DealerForm} from '@/components/forms/dealer-form'
import type {Dealer} from '@/types/api'
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
                        <h1 className='text-3xl font-bold tracking-tight'>Edit Dealer</h1>
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
            <div className='flex items-center gap-4'>
                <Link href='/admin/dealers'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Dealer</h1>
                    <p className='text-muted-foreground'>Update dealer information</p>
                </div>
            </div>

            <DealerForm dealer={dealer} mode='edit' />
        </div>
    )
}
