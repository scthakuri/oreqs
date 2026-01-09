import {axiosClient} from '../axios-client'
import type {Campaign, CampaignStats, PaginatedResponse} from '@/types/api'

interface CampaignListParams {
    page?: number
    search?: string
    status?: string
    campaign_type?: string
    client?: number
    dealer?: number
    country?: number
    branch?: number
    ordering?: string
}

export interface CampaignCreateData {
    name: string
    description?: string
    campaign_type: 'scratch_card' | 'spin_wheel' | 'lucky_draw' | 'instant_win'
    status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
    start_date: string
    end_date: string
    client: number
    dealer?: number
    country?: number
    branch?: number
    applies_to_all_branches?: boolean
    branches?: number[]
    timezone?: string
}

export interface CampaignUpdateData {
    name?: string
    description?: string
    campaign_type?: 'scratch_card' | 'spin_wheel' | 'lucky_draw' | 'instant_win'
    status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
    start_date?: string
    end_date?: string
    client?: number
    dealer?: number
    country?: number
    branch?: number
    applies_to_all_branches?: boolean
    branches?: number[]
    timezone?: string
}

export const campaignsApi = {
    async list(params?: CampaignListParams): Promise<PaginatedResponse<Campaign>> {
        const response = await axiosClient.get<PaginatedResponse<Campaign>>('/campaigns/', {params})
        return response.data
    },

    async get(id: number): Promise<Campaign> {
        const response = await axiosClient.get<Campaign>(`/campaigns/${id}/`)
        return response.data
    },

    async create(data: CampaignCreateData): Promise<Campaign> {
        const response = await axiosClient.post<Campaign>('/campaigns/', data)
        return response.data
    },

    async update(id: number, data: CampaignUpdateData): Promise<Campaign> {
        const response = await axiosClient.patch<Campaign>(`/campaigns/${id}/`, data)
        return response.data
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/campaigns/${id}/`)
    },

    async stats(): Promise<CampaignStats> {
        const response = await axiosClient.get<CampaignStats>('/campaigns/stats/')
        return response.data
    },

    async activate(id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/activate/`)
        return response.data
    },

    async pause(id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/pause/`)
        return response.data
    },

    async resume(id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/resume/`)
        return response.data
    },

    async complete(id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/complete/`)
        return response.data
    },

    async cancel(id: number): Promise<{message: string; status: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/cancel/`)
        return response.data
    },

    async refreshQr(id: number): Promise<{success: string; url: string}> {
        const response = await axiosClient.post(`/campaigns/${id}/refresh-qr/`)
        return response.data
    },
}
