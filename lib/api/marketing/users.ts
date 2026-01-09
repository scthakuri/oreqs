import {axiosClient} from '@/lib/axios-client';
import {PaginatedResponse} from "@/types/api";
import {MarketingUser, MarketingUserCreateData, MarketingUserUpdateData} from "@/types/marketing/user";

export interface MarketingStats {
    total_users: number;
    total_groups: number;
}

export interface ImportResult {
    message: string;
    added: Array<{
        row: number;
        data: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
        };
    }>;
    skipped: Array<{
        row: number;
        data: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
        };
        reason: string;
    }>;
    failed: Array<{
        row: number;
        data: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
        };
        reason: string;
    }>;
    summary: {
        total: number;
        added: number;
        skipped: number;
        failed: number;
    };
}

export const marketingUsersApi = {
    async list(params?: {
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<MarketingUser>> {
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
        const response = await axiosClient.get<PaginatedResponse<MarketingUser>>(`/marketing/marketing-users/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<MarketingUser> {
        const response = await axiosClient.get<MarketingUser>(`/marketing/marketing-users/${id}/`);
        return response.data;
    },

    async create(data: MarketingUserCreateData): Promise<MarketingUser> {
        const response = await axiosClient.post<MarketingUser>('/marketing/marketing-users/', data);
        return response.data;
    },

    async update(id: number, data: Partial<MarketingUserUpdateData>): Promise<MarketingUser> {
        const response = await axiosClient.patch<MarketingUser>(`/marketing/marketing-users/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/marketing/marketing-users/${id}/`);
    },

    async stats(): Promise<MarketingStats> {
        const response = await axiosClient.get<MarketingStats>('/marketing/marketing-users/stats/');
        return response.data;
    },

    async importUsers(file: File, groupId?: number): Promise<ImportResult> {
        const formData = new FormData();
        formData.append('file', file);
        if (groupId) {
            formData.append('group_id', groupId.toString());
        }
        const response = await axiosClient.post<ImportResult>('/marketing/marketing-users/import_users/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};