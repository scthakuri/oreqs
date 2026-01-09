import {redirect} from 'next/navigation'
import {getServerSession} from '@/lib/session-server'

export default async function RootPage() {
    const session = await getServerSession()

    if (session?.user) {
        redirect('/admin')
    } else {
        redirect('/login')
    }
}
