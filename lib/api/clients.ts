import type {Client, ClientCreateData, ClientUpdateData, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const clientsApi = {
    async list(params?: {
        dealer?: number;
        subscription_plan?: 'demo' | 'premium' | 'lifetime';
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Client>> {
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
        const response = await axiosClient.get<PaginatedResponse<Client>>(`/clients/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<Client> {
        const response = await axiosClient.get<Client>(`/clients/${id}/`);
        return response.data;
    },

    async create(data: ClientCreateData): Promise<Client> {
        const response = await axiosClient.post<Client>('/clients/', data);
        return response.data;
    },

    async update(id: number, data: Partial<ClientUpdateData>): Promise<Client> {
        const response = await axiosClient.patch<Client>(`/clients/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/clients/${id}/`);
    },
};
