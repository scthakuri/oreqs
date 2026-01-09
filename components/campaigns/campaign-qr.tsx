"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {QrCode, RefreshCw, Download} from "lucide-react";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {campaignsApi} from "@/lib/api/campaigns";
import {toast} from "sonner";

const CampaignQr = ({qr_image, campaign_id}: {
    qr_image: string | null,
    campaign_id: number
}) => {
    const [qrImage, setQrImage] = React.useState<string | null>(qr_image);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const refreshQr = useMutation({
        mutationFn: () => campaignsApi.refreshQr(campaign_id),
        onSuccess: async (data) => {
            toast.success("QR refreshed successfully")
            setQrImage(data.url)
        },
        onError: () => {
            toast.error('Failed to refresh QR code')
        },
    })

    const downloadQr = React.useCallback(async () => {
        if (!qrImage) return;

        setIsDownloading(true);
        try {
            const response = await fetch(qrImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `campaign-${campaign_id}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("QR code downloaded successfully");
        } catch {
            toast.error("Failed to download QR code");
        } finally {
            setIsDownloading(false);
        }
    }, [qrImage, campaign_id]);

    const handleRefreshQr = React.useCallback(() => {
        refreshQr.mutate();
    }, [refreshQr]);

    React.useEffect(() => {
        if (!qr_image) {
            refreshQr.mutate();
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Campaign QR Code</CardTitle>
                        <CardDescription>Scan to access campaign</CardDescription>
                    </div>
                    <Button
                        variant='outline'
                        size='icon'
                        onClick={handleRefreshQr}
                        disabled={refreshQr.isPending}
                    >
                        <RefreshCw className={`size-4 ${refreshQr.isPending ? 'animate-spin' : ''}`}/>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex justify-center p-4 bg-muted rounded-lg'>
                    <div className='bg-white p-4 rounded-lg'>
                        {
                            qrImage ? <Image
                                src={qrImage}
                                alt='Campaign QR Code'
                                width={150}
                                height={150}
                            /> : <QrCode className='w-[150px] h-[150px] text-muted-foreground'/>
                        }
                    </div>
                </div>
                <Button
                    className='w-full'
                    variant='outline'
                    disabled={!qrImage || isDownloading}
                    onClick={downloadQr}
                >
                    {isDownloading ? (
                        <>
                            <RefreshCw className='mr-2 size-4 animate-spin'/>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className='mr-2 size-4'/>
                            Download QR Code
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

export default CampaignQr;