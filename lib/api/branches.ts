import type {Branch, BranchCreateData, BranchUpdateData, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const branchesApi = {
    async list(params?: {
        client?: number;
        is_active?: boolean;
        city?: string;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Branch>> {
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
        const response = await axiosClient.get<PaginatedResponse<Branch>>(`/branches/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<Branch> {
        const response = await axiosClient.get<Branch>(`/branches/${id}/`);
        return response.data;
    },

    async create(data: BranchCreateData): Promise<Branch> {
        const response = await axiosClient.post<Branch>('/branches/', data);
        return response.data;
    },

    async update(id: number, data: Partial<BranchUpdateData>): Promise<Branch> {
        const response = await axiosClient.patch<Branch>(`/branches/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/branches/${id}/`);
    },

    async getClientBranches(clientId: number): Promise<Branch[]> {
        const response = await axiosClient.get<Branch[]>(`/clients/${clientId}/branches/`);
        return response.data;
    },
};
