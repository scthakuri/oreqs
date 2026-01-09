export interface IntegrationFieldType {
    name: string
    label: string
    type: 'string' | 'number' | 'boolean' | 'select'
    required: boolean
    options?: string[]
}

export interface Integration {
    id: string
    type: string
    title: string
    description: string
    is_active: boolean
    is_verified: boolean
    config: Record<string, string | number | boolean>
    fields?: IntegrationFieldType[]
    created_at: string
    updated_at: string
}

export interface IntegrationListItem {
    id: string
    type: string
    title: string
    description: string
    is_active: boolean
    is_verified: boolean
    created_at: string
}