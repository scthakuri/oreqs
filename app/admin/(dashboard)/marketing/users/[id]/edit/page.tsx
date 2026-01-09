import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { UserForm } from '@/components/marketing/users/user-form';
import { serverApiGet } from '@/lib/server-api';
import { MarketingUser } from '@/types/marketing/user';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function EditUser({ id }: { id: string }) {
    const user = await serverApiGet<MarketingUser>(`/marketing/marketing-users/${id}/`);
    return <UserForm user={user} />;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-muted-foreground" />}>
            <EditUser id={id} />
        </Suspense>
    );
}
