import type {Country, CountryCreateData, PaginatedResponse} from '@/types/api';
import {axiosClient} from '../axios-client';

export const countriesApi = {
    async list(params?: {
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Country>> {
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
        const response = await axiosClient.get<PaginatedResponse<Country>>(`/countries/${queryString}`);
        return response.data;
    },

    async get(id: number): Promise<Country> {
        const response = await axiosClient.get<Country>(`/countries/${id}/`);
        return response.data;
    },

    async create(data: CountryCreateData | FormData): Promise<Country> {
        const config = data instanceof FormData
            ? {headers: {'Content-Type': 'multipart/form-data'}}
            : undefined;
        const response = await axiosClient.post<Country>('/countries/', data, config);
        return response.data;
    },

    async update(id: number, data: Partial<CountryCreateData> | FormData): Promise<Country> {
        const config = data instanceof FormData
            ? {headers: {'Content-Type': 'multipart/form-data'}}
            : undefined;
        const response = await axiosClient.patch<Country>(`/countries/${id}/`, data, config);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/countries/${id}/`);
    },
};
