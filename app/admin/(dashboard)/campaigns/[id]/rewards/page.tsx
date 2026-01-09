import {notFound} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import type {Campaign} from '@/types/api'
import {CampaignRewards} from '@/components/campaigns/campaign-rewards'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Campaign Rewards | OREQS',
    description: 'View all campaign rewards and redemptions',
}

async function getCampaign(id: string): Promise<Campaign | null> {
    try {
        return await serverApiGet<Campaign>(`/campaigns/${id}/`)
    } catch {
        return null
    }
}

export default async function CampaignRewardsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    return <CampaignRewards campaign={campaign} />
}
