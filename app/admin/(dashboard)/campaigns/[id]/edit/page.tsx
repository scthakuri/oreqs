import {notFound} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import type {Campaign} from '@/types/api'
import {Metadata} from "next";
import CampaignEditForm from "@/components/campaigns/campaign-edit-form";

export const metadata: Metadata = {
    title: 'Edit Campaign | OREQS',
    description: 'Edit campaign details and settings',
}

async function getCampaign(id: string): Promise<Campaign | null> {
    try {
        return await serverApiGet<Campaign>(`/campaigns/${id}/`)
    } catch {
        return null
    }
}

export default async function CampaignEditPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    return (
        <div className='h-screen flex flex-col bg-background'>
            <CampaignEditForm campaign={campaign} />
        </div>
    )
}
