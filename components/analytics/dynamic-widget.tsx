'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, AlertCircle, Users, Building, QrCode, GitBranch } from 'lucide-react';
import { Widget } from '@/lib/api/analytics';

const iconMap: Record<string, any> = {
  mail: Mail,
  send: Send,
  'alert-circle': AlertCircle,
  users: Users,
  building: Building,
  'qr-code': QrCode,
  'git-branch': GitBranch,
};

export function DynamicWidget({ widget }: { widget: Widget }) {
  if (widget.type === 'stat_card') {
    const Icon = iconMap[widget.icon] || Mail;
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{widget.value.toLocaleString()}</div>
        </CardContent>
      </Card>
    );
  }

  if (widget.type === 'chart') {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Chart rendering not implemented</div>
        </CardContent>
      </Card>
    );
  }

  if (widget.type === 'table') {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {widget.columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {widget.data.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2">{row.status}</td>
                    <td className="px-4 py-2">{`${row.created_by__first_name} ${row.created_by__last_name}`}</td>
                    <td className="px-4 py-2">{new Date(row.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
