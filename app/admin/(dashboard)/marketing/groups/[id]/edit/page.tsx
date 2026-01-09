import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { GroupForm } from '@/components/marketing/groups/group-form';
import { serverApiGet } from '@/lib/server-api';
import { Group } from '@/types/marketing/group';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function EditGroup({ id }: { id: string }) {
    const group = await serverApiGet<Group>(`/marketing/groups/${id}/`);
    return <GroupForm group={group} />;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-muted-foreground" />}>
            <EditGroup id={id} />
        </Suspense>
    );
}
