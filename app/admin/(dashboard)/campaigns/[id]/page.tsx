import {notFound} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import type {Campaign} from '@/types/api'
import {CampaignDetail} from '@/components/campaigns/campaign-detail'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Campaign Details | OREQS',
    description: 'View campaign details and statistics',
}

async function getCampaign(id: string): Promise<Campaign | null> {
    try {
        return await serverApiGet<Campaign>(`/campaigns/${id}/`)
    } catch {
        return null
    }
}

export default async function CampaignDetailPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    return <CampaignDetail campaign={campaign} />
}
