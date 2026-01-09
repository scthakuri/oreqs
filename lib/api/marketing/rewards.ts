import {axiosClient} from '../../axios-client'

export interface Reward {
    id: number
    name: string
    description?: string
    value?: string
    image?: string
    probability: number
    total_available: number
    remaining: number
    color: string
    is_active: boolean
}

export interface RewardCreateData {
    name: string
    description?: string
    value?: string
    image?: File | string
    probability: number
    total_available: number
    color?: string
}

export interface RewardListResponse {
    total: number
    total_available: number
    total_probability: number
    rewards: Reward[]
}

export const rewardsApi = {
    async list(campaignId: number): Promise<RewardListResponse> {
        const response = await axiosClient.get<RewardListResponse>(
            `/campaigns/${campaignId}/rewards/`
        )
        return response.data
    },

    async get(campaignId: number, id: number): Promise<Reward> {
        const response = await axiosClient.get<Reward>(
            `/campaigns/${campaignId}/rewards/${id}/`
        )
        return response.data
    },

    async create(campaignId: number, data: RewardCreateData | FormData): Promise<Reward> {
        const config =
            data instanceof FormData
                ? {headers: {'Content-Type': 'multipart/form-data'}}
                : undefined
        const response = await axiosClient.post<Reward>(
            `/campaigns/${campaignId}/rewards/`,
            data,
            config
        )
        return response.data
    },

    async update(
        campaignId: number,
        id: number,
        data: Partial<RewardCreateData> | FormData
    ): Promise<Reward> {
        const config =
            data instanceof FormData
                ? {headers: {'Content-Type': 'multipart/form-data'}}
                : undefined
        const response = await axiosClient.patch<Reward>(
            `/campaigns/${campaignId}/rewards/${id}/`,
            data,
            config
        )
        return response.data
    },

    async delete(campaignId: number, id: number): Promise<void> {
        await axiosClient.delete(`/campaigns/${campaignId}/rewards/${id}/`)
    },
}
