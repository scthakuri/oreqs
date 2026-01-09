import type {
    Campaign,
    CampaignCreateData,
    CampaignUpdateData,
    Template,
    TemplateCreateData,
    TemplateUpdateData,
    CampaignRecipient,
    CampaignReport,
    PaginatedResponse
} from '@/types/marketing/campaign';
import {axiosClient} from "@/lib/axios-client";

type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push_notification';

export const campaignsApi = {
    async list(campaignType: CampaignType, params?: {
        client_id?: number;
        dealer_id?: number;
        status?: string;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Campaign>> {
        const filteredParams: Record<string, string> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    filteredParams[key] = String(value);
                }
            });
        }
        const queryString = Object.keys(filteredParams).length > 0
            ? '?' + new URLSearchParams(filteredParams).toString()
            : '';
        const response = await axiosClient.get<PaginatedResponse<Campaign>>(
            `/marketing/${campaignType}/campaigns/${queryString}`
        );
        return response.data;
    },

    async get(campaignType: CampaignType, id: number): Promise<Campaign> {
        const response = await axiosClient.get<Campaign>(
            `/marketing/${campaignType}/campaigns/${id}/`
        );
        return response.data;
    },

    async create(campaignType: CampaignType, data: CampaignCreateData): Promise<Campaign> {
        const response = await axiosClient.post<Campaign>(
            `/marketing/${campaignType}/campaigns/`,
            data
        );
        return response.data;
    },

    async update(campaignType: CampaignType, id: number, data: Partial<CampaignUpdateData>): Promise<Campaign> {
        const response = await axiosClient.patch<Campaign>(
            `/marketing/${campaignType}/campaigns/${id}/`,
            data
        );
        return response.data;
    },

    async delete(campaignType: CampaignType, id: number): Promise<void> {
        await axiosClient.delete(`/marketing/${campaignType}/campaigns/${id}/`);
    },

    async send(campaignType: CampaignType, id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(
            `/marketing/${campaignType}/campaigns/${id}/send/`
        );
        return response.data;
    },

    async pause(campaignType: CampaignType, id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(
            `/marketing/${campaignType}/campaigns/${id}/pause/`
        );
        return response.data;
    },

    async cancel(campaignType: CampaignType, id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(
            `/marketing/${campaignType}/campaigns/${id}/cancel/`
        );
        return response.data;
    },

    async getReport(campaignType: CampaignType, id: number): Promise<CampaignReport> {
        const response = await axiosClient.get<CampaignReport>(
            `/marketing/${campaignType}/campaigns/${id}/report/`
        );
        return response.data;
    },
};

export const templatesApi = {
    async list(campaignType: CampaignType, params?: {
        category?: string;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Template>> {
        const filteredParams: Record<string, string> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    filteredParams[key] = String(value);
                }
            });
        }
        const queryString = Object.keys(filteredParams).length > 0
            ? '?' + new URLSearchParams(filteredParams).toString()
            : '';
        const response = await axiosClient.get<PaginatedResponse<Template>>(
            `/marketing/${campaignType}/templates/${queryString}`
        );
        return response.data;
    },

    async get(campaignType: CampaignType, id: number): Promise<Template> {
        const response = await axiosClient.get<Template>(
            `/marketing/${campaignType}/templates/${id}/`
        );
        return response.data;
    },

    async create(campaignType: CampaignType, data: TemplateCreateData): Promise<Template> {
        const response = await axiosClient.post<Template>(
            `/marketing/${campaignType}/templates/`,
            data
        );
        return response.data;
    },

    async update(campaignType: CampaignType, id: number, data: Partial<TemplateUpdateData>): Promise<Template> {
        const response = await axiosClient.patch<Template>(
            `/marketing/${campaignType}/templates/${id}/`,
            data
        );
        return response.data;
    },

    async delete(campaignType: CampaignType, id: number): Promise<void> {
        await axiosClient.delete(`/marketing/${campaignType}/templates/${id}/`);
    },
};

export const recipientsApi = {
    async list(params?: {
        campaign?: number;
        status?: string;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<CampaignRecipient>> {
        const filteredParams: Record<string, string> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    filteredParams[key] = String(value);
                }
            });
        }
        const queryString = Object.keys(filteredParams).length > 0
            ? '?' + new URLSearchParams(filteredParams).toString()
            : '';
        const response = await axiosClient.get<PaginatedResponse<CampaignRecipient>>(
            `/marketing/recipients/${queryString}`
        );
        return response.data;
    },

    async get(id: number): Promise<CampaignRecipient> {
        const response = await axiosClient.get<CampaignRecipient>(
            `/marketing/recipients/${id}/`
        );
        return response.data;
    },
};