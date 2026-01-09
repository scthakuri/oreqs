'use client'

import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {ClientForm} from '@/components/forms/client-form'

export default function Page() {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/clients'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Add New Client</h1>
                    <p className='text-muted-foreground'>Create a new client account</p>
                </div>
            </div>

            <ClientForm mode='create' />
        </div>
    )
}
