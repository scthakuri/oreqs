import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { GroupDetailClient } from '@/components/marketing/groups/group-detail-client';
import { serverApiGet } from '@/lib/server-api';
import {Group} from "@/types/marketing/group";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function GroupDetail({ id }: { id: string }) {
    const group = await serverApiGet<Group>(`/marketing/groups/${id}/`);
    return <GroupDetailClient group={group} />;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-muted-foreground" />}>
            <GroupDetail id={id} />
        </Suspense>
    );
}
