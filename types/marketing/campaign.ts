// Campaign Types
export interface Campaign {
    id: number
    campaign_type: 'email' | 'sms' | 'whatsapp' | 'push_notification'
    campaign_type_display: string
    name: string
    description?: string
    template?: number
    template_name?: string
    subject?: string
    message?: string
    status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled' | 'failed' | 'paused'
    status_display: string
    scheduled_date?: string
    sent_at?: string
    completed_at?: string
    send_to_all: boolean
    dealer?: number
    dealer_name?: string
    clients?: number[]
    branch?: number[]
    groups?: number[]
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: number
    created_by_name: string
    recipient_count?: number
    report?: CampaignReport
    recipients?: CampaignRecipient[]
}

export interface CampaignCreateData {
    campaign_type: 'email' | 'sms' | 'whatsapp' | 'push_notification'
    name: string
    description?: string
    template?: number
    subject?: string
    message?: string
    status?: 'draft' | 'scheduled'
    scheduled_date?: string
    send_to_all?: boolean
    dealer?: number
    clients?: number[]
    branch?: number[]
    groups?: number[]
    is_active?: boolean
}

export interface CampaignUpdateData extends Partial<CampaignCreateData> {}

// Template Types
export interface Template {
    id: number
    campaign_type: 'email' | 'sms' | 'whatsapp' | 'push_notification'
    campaign_type_display: string
    name: string
    subject?: string
    preview_text?: string
    category: string
    category_display: string
    message?: string
    variables?: Record<string, any>
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: number
    created_by_name: string
}

export interface TemplateCreateData {
    campaign_type?: 'email' | 'sms' | 'whatsapp' | 'push_notification'
    name: string
    subject?: string
    preview_text?: string
    category: string
    message?: string
    variables?: Record<string, any>
    description?: string
    is_active?: boolean
}

export interface TemplateUpdateData extends Partial<TemplateCreateData> {}

// Campaign Recipient Types
export interface CampaignRecipient {
    id: number
    campaign: number
    client?: number
    client_name?: string
    email?: string
    phone?: string
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'opened' | 'unsubscribed'
    sent_at?: string
    delivered_at?: string
    opened_at?: string
    open_count: number
    success_response?: Record<string, string>
    error_response?: Record<string, string>
    metadata?: Record<string, string>
    created_at: string
    updated_at: string
}

export interface CampaignReport {
    id: number
    campaign: number
    campaign_name: string
    generated_at: string
    updated_at: string
    total_recipients: number
    sent_count: number
    delivered_count: number
    failed_count: number
    opened_count: number
    unique_opens: number
    open_rate: number
    delivery_rate: number
}


export interface RewardType {
    id: number
    name: string
    reward_type: 'discount' | 'product' | 'cashback'
    value: string
    description?: string
    probability: number
    total_available: number
    image?: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}