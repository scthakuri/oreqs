import type {UserMinimal, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const usersApi = {
    async list(params?: {
        role?: 'superadmin' | 'countryadmin' | 'dealer' | 'client' | 'branch' | 'staff';
        country?: number;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<UserMinimal>> {
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
        const response = await axiosClient.get<PaginatedResponse<UserMinimal>>(`/api/users/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<UserMinimal> {
        const response = await axiosClient.get<UserMinimal>(`/api/users/${id}/`);
        return response.data;
    },
};
