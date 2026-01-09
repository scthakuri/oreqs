'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function SMSReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['sms-reports'],
    queryFn: () => analyticsApi.getSMSReports(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">SMS Reports</h1>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">SMS Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Campaign</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Provider</th>
                  <th className="px-4 py-2 text-left">Credits</th>
                  <th className="px-4 py-2 text-left">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="px-4 py-2">{row.campaign__name}</td>
                    <td className="px-4 py-2">{row.recipient_phone}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{row.message}</td>
                    <td className="px-4 py-2">
                      <Badge variant={row.status === 'sent' ? 'default' : row.status === 'failed' ? 'destructive' : 'secondary'}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{row.provider}</td>
                    <td className="px-4 py-2">{row.credits_used}</td>
                    <td className="px-4 py-2">{row.sent_at ? new Date(row.sent_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
