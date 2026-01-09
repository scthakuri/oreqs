import {AlertCircle, RefreshCw, Home, ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    icon?: 'error' | 'warning' | 'info';
    showRefresh?: boolean;
    showHome?: boolean;
    showBack?: boolean;
    backUrl?: string;
    backLabel?: string;
    onRefresh?: () => void;
}

const iconMap = {
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
};

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    icon = 'error',
    showRefresh = false,
    showHome = false,
    showBack = false,
    backUrl,
    backLabel = 'Go Back',
    onRefresh,
}: ErrorDisplayProps) {
    const Icon = iconMap[icon];

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    return (
        <div className='flex items-center justify-center min-h-[400px]'>
            <Card className='max-w-md w-full'>
                <CardHeader className='text-center'>
                    <div className='flex justify-center mb-4'>
                        <div className='rounded-full bg-destructive/10 p-3'>
                            <Icon className='size-8 text-destructive' />
                        </div>
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                    {showRefresh && (
                        <Button onClick={handleRefresh} variant='default' className='w-full'>
                            <RefreshCw className='size-4 mr-2' />
                            Refresh Page
                        </Button>
                    )}
                    {showHome && (
                        <Link href='/admin' className='w-full'>
                            <Button variant='outline' className='w-full'>
                                <Home className='size-4 mr-2' />
                                Go to Home
                            </Button>
                        </Link>
                    )}
                    {showBack && backUrl && (
                        <Link href={backUrl} className='w-full'>
                            <Button variant='outline' className='w-full'>
                                <ArrowLeft className='size-4 mr-2' />
                                {backLabel}
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
