import {notFound} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import type {Campaign} from '@/types/api'
import {CampaignAnalytics} from '@/components/campaigns/campaign-analytics'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Campaign Analytics | OREQS',
    description: 'View campaign analytics and insights',
}

async function getCampaign(id: string): Promise<Campaign | null> {
    try {
        return await serverApiGet<Campaign>(`/campaigns/${id}/`)
    } catch {
        return null
    }
}

export default async function CampaignAnalyticsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    return <CampaignAnalytics campaign={campaign} />
}
