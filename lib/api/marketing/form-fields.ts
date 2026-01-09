import {axiosClient} from '../../axios-client'

export type FieldType = 'text' | 'email' | 'phone' | 'select' | 'checkbox'

export interface FormField {
    id: number
    label: string
    field_type: FieldType
    is_required: boolean
    options?: string[]
    order: number
    is_primary: boolean
}

export interface FormFieldCreateData {
    label: string
    field_type: FieldType
    is_required: boolean
    options?: string[]
    order?: number
    is_primary: boolean
}

export interface FormFieldListResponse {
    total: number
    form_fields: FormField[]
}

export const formFieldsApi = {
    async list(campaignId: number): Promise<FormField[]> {
        const response = await axiosClient.get<FormField[]>(
            `/campaigns/${campaignId}/form-fields/`
        )
        return response.data
    },

    async get(campaignId: number, id: number): Promise<FormField> {
        const response = await axiosClient.get<FormField>(
            `/campaigns/${campaignId}/form-fields/${id}/`
        )
        return response.data
    },

    async create(campaignId: number, data: FormFieldCreateData): Promise<FormField> {
        const response = await axiosClient.post<FormField>(
            `/campaigns/${campaignId}/form-fields/`,
            data
        )
        return response.data
    },

    async update(
        campaignId: number,
        id: number,
        data: Partial<FormFieldCreateData>
    ): Promise<FormField> {
        const response = await axiosClient.patch<FormField>(
            `/campaigns/${campaignId}/form-fields/${id}/`,
            data
        )
        return response.data
    },

    async delete(campaignId: number, id: number): Promise<void> {
        await axiosClient.delete(`/campaigns/${campaignId}/form-fields/${id}/`)
    },

    async reorder(campaignId: number, fieldIds: number[]): Promise<void> {
        await axiosClient.post(`/campaigns/${campaignId}/form-fields/reorder/`, {
            field_ids: fieldIds
        })
    }
}