import {Mail} from "lucide-react";
import {Metadata} from "next";
import {IntegrationList} from "@/components/marketing/integration";

export const metadata: Metadata = {
    title: 'Marketing Integration',
    description: 'Create and manage email campaigns for your clients',
}

const Page = async () => {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Mail className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Marketing Integration</h1>
                    <p className='text-muted-foreground'>Create and manage email campaigns for your clients</p>
                </div>
            </div>

            <IntegrationList />
        </div>
    )
}

export default Page;