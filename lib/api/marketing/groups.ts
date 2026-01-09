import type {
    Group,
    GroupCreateData,
    GroupUpdateData,
    PaginatedResponse
} from '@/types/marketing/group';
import {axiosClient} from "@/lib/axios-client";
import {MarketingUser} from "@/types/marketing/user";


export const groupsApi = {
    async list(params?: {
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Group>> {
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
        const response = await axiosClient.get<PaginatedResponse<Group>>(
            `/marketing/groups/${queryString}`
        );
        return response.data;
    },

    async get(id: number): Promise<Group> {
        const response = await axiosClient.get<Group>(`/marketing/groups/${id}/`);
        return response.data;
    },

    async create(data: GroupCreateData): Promise<Group> {
        const response = await axiosClient.post<Group>('/marketing/groups/', data);
        return response.data;
    },

    async update(id: number, data: Partial<GroupUpdateData>): Promise<Group> {
        const response = await axiosClient.patch<Group>(`/marketing/groups/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/marketing/groups/${id}/`);
    },

    async getMembers(id: number, params?: {
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
        const response = await axiosClient.get<PaginatedResponse<MarketingUser>>(
            `/marketing/groups/${id}/members/${queryString}`
        );
        return response.data;
    },

    async addMembers(id: number, user_ids: number[]): Promise<void> {
        await axiosClient.post(`/marketing/groups/${id}/add_members/`, {user_ids});
    },

    async removeMembers(id: number, user_ids: number[]): Promise<void> {
        await axiosClient.post(`/marketing/groups/${id}/remove_members/`, {user_ids});
    },
};