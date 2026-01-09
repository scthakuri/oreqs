import { axiosClient } from '../axios-client';

export interface StatCard {
  type: 'stat_card';
  title: string;
  value: number;
  icon: string;
  trend?: number;
}

export interface Chart {
  type: 'chart';
  chart_type: 'bar' | 'line' | 'pie';
  title: string;
  data: any;
}

export interface Table {
  type: 'table';
  title: string;
  columns: string[];
  data: any[];
}

export type Widget = StatCard | Chart | Table;

export interface DashboardResponse {
  widgets: Widget[];
}

export interface EmailReportRow {
  id: number;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  open_count: number;
  campaign__name: string;
  error_message: string | null;
}

export interface SMSReportRow {
  id: number;
  recipient_phone: string;
  message: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  provider: string;
  campaign__name: string;
  error_message: string | null;
  credits_used: number;
}

export const analyticsApi = {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axiosClient.get<DashboardResponse>('/analytics/dashboard/');
    return response.data;
  },

  async getEmailReports(): Promise<{ data: EmailReportRow[] }> {
    const response = await axiosClient.get<{ data: EmailReportRow[] }>('/analytics/reports/email/');
    return response.data;
  },

  async getSMSReports(): Promise<{ data: SMSReportRow[] }> {
    const response = await axiosClient.get<{ data: SMSReportRow[] }>('/analytics/reports/sms/');
    return response.data;
  },
};
