import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {DealerForm} from '@/components/forms/dealer-form'

export default function Page() {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Link href='/admin/dealers'>
                    <Button variant='ghost' size='icon'>
                        <ArrowLeft className='size-4'/>
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Add New Dealer</h1>
                    <p className='text-muted-foreground'>Create a new dealer account</p>
                </div>
            </div>

            <DealerForm mode='create' />
        </div>
    )
}
