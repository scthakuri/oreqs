import type {Dealer, DealerCreateData, DealerUpdateData, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const dealersApi = {
    async list(params?: {
        country?: number;
        subscription_plan?: 'demo' | 'premium' | 'lifetime';
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Dealer>> {
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
        const response = await axiosClient.get<PaginatedResponse<Dealer>>(`/dealers/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<Dealer> {
        const response = await axiosClient.get<Dealer>(`/dealers/${id}/`);
        return response.data;
    },

    async create(data: DealerCreateData): Promise<Dealer> {
        const response = await axiosClient.post<Dealer>('/dealers/', data);
        return response.data;
    },

    async update(id: number, data: Partial<DealerUpdateData>): Promise<Dealer> {
        const response = await axiosClient.patch<Dealer>(`/dealers/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/dealers/${id}/`);
    },
};
