import {notFound} from 'next/navigation'
import {serverApiGet} from '@/lib/server-api'
import type {Campaign} from '@/types/api'
import {CampaignScans} from '@/components/campaigns/campaign-scans'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Campaign Scans | OREQS',
    description: 'View all campaign scans and activity',
}

async function getCampaign(id: string): Promise<Campaign | null> {
    try {
        return await serverApiGet<Campaign>(`/campaigns/${id}/`)
    } catch {
        return null
    }
}

export default async function CampaignScansPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    return <CampaignScans campaign={campaign} />
}
