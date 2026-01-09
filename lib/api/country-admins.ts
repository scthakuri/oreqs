import type {CountryAdmin, CountryAdminCreateData, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const countryAdminsApi = {
    async list(params?: {
        country?: number;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<CountryAdmin>> {
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
        const response = await axiosClient.get<PaginatedResponse<CountryAdmin>>(`/country-admins/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<CountryAdmin> {
        const response = await axiosClient.get<CountryAdmin>(`/country-admins/${id}/`);
        return response.data;
    },

    async create(data: CountryAdminCreateData): Promise<CountryAdmin> {
        const response = await axiosClient.post<CountryAdmin>('/country-admins/', data);
        return response.data;
    },

    async update(id: number, data: Partial<CountryAdminCreateData>): Promise<CountryAdmin> {
        const response = await axiosClient.patch<CountryAdmin>(`/country-admins/${id}/`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/country-admins/${id}/`);
    },
};
