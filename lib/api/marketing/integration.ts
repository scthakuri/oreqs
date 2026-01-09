import type {
    Integration,
    IntegrationCreatePayload,
    IntegrationUpdatePayload,
    IntegrationUpdateStatusPayload,
    VerifyOtpPayload,
    IntegrationApiResponse,
    IntegrationSchema,
} from '@/types/marketing/integration'
import {axiosClient} from "@/lib/axios-client";

const BASE_URL = '/marketing/integrations'

export const integrationsApi = {
    /**
     * Get all integrations (includes unconfigured ones with schemas)
     * Returns both configured integrations (with id) and unconfigured ones (id: null)
     */
    getAll: async (): Promise<Integration[]> => {
        const response = await axiosClient.get<Integration[]>(`${BASE_URL}/`)
        return response.data
    },

    /**
     * Get single integration by ID
     */
    getById: async (id: number): Promise<Integration> => {
        const response = await axiosClient.get<Integration>(`${BASE_URL}/${id}/`)
        return response.data
    },

    /**
     * Get all available integration schemas
     * Useful if you want to display schemas separately from configured integrations
     */
    getSchemas: async (): Promise<IntegrationSchema[]> => {
        const response = await axiosClient.get<IntegrationSchema[]>(`${BASE_URL}/schemas/`)
        return response.data
    },

    /**
     * Create new integration
     * Sends OTP for verification automatically
     */
    create: async (payload: IntegrationCreatePayload): Promise<Integration> => {
        const response = await axiosClient.post<IntegrationApiResponse>(`${BASE_URL}/`, payload)
        return response.data.integration
    },

    /**
     * Update integration configuration
     * Sends new OTP if configuration changes
     */
    update: async (id: number | null, payload: IntegrationUpdatePayload): Promise<Integration> => {
        const response = await axiosClient.patch<IntegrationApiResponse>(`${BASE_URL}/${id}/`, payload)
        return response.data.integration
    },

    /**
     * Verify OTP code
     * Activates the integration upon successful verification
     */
    verifyOtp: async (payload: VerifyOtpPayload): Promise<Integration> => {
        const {integration_id, otp} = payload
        const response = await axiosClient.post<IntegrationApiResponse>(
            `${BASE_URL}/${integration_id}/verify_otp/`,
            {otp}
        )
        return response.data.integration
    },

    /**
     * Resend OTP code
     * Generates and sends a new OTP to the registered contact
     */
    resendOtp: async (id: number): Promise<{ message: string }> => {
        const response = await axiosClient.post<{ message: string }>(
            `${BASE_URL}/${id}/resend_otp/`,
            {}
        )
        return response.data
    },

    /**
     * Update integration status (activate/deactivate)
     * Only works for verified integrations
     */
    updateStatus: async (
        id: number,
        payload: IntegrationUpdateStatusPayload
    ): Promise<Integration> => {
        const response = await axiosClient.patch<IntegrationApiResponse>(
            `${BASE_URL}/${id}/update_status/`,
            payload
        )
        return response.data.integration
    },

    /**
     * Delete integration
     * Permanently removes the integration configuration
     */
    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`${BASE_URL}/${id}/`)
    },
}