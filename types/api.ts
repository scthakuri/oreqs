export interface Company {
    id: number;
    name: string;
    registration_number: string | null;
    tax_id: string | null;
    country: number;
    country_data: Country;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    logo: string | null;
    created_at: string;
    updated_at: string;
}

export interface Country {
    id: number;
    name: string;
    code: string;
    flag: string | null;
    dial_code: string;
    domain: string | null;
    currency_code: string;
    currency_symbol: string;
    is_active: boolean;
    dealers_count: number;
    clients_count: number;
    branches_count: number;
    created_at: string;
    updated_at: string;
}

export interface UserMinimal {
    id: number;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    role: 'superadmin' | 'countryadmin' | 'dealer' | 'client' | 'branch' | 'staff';
    is_active: boolean;
}

export interface Dealer {
    id: number;
    user: UserMinimal;
    country: number;
    country_data: Country;
    country_admin: number;
    company: number | null;
    company_data: Company | null;
    subscription_plan: 'demo' | 'premium';
    subscription_start: string;
    subscription_end: string;
    is_subscription_active: boolean;
    is_active: boolean;
    clients_count: number;
    campaigns_count: number;
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: number;
    user: UserMinimal;
    dealer: number;
    dealer_data: Dealer;
    company: number | null;
    company_data: Company | null;
    country: number;
    country_data: Country;
    subscription_plan: 'demo' | 'premium' | 'lifetime';
    subscription_start: string;
    subscription_end: string | null;
    is_subscription_active: boolean;
    is_active: boolean;
    branches_count: number;
    campaigns_count: number;
    created_at: string;
    updated_at: string;

    enable_campaign: boolean;
    enable_sms_marketing: boolean;
    enable_email_marketing: boolean;
    use_own_sms_gateway: boolean;
    use_own_email_service: boolean;
}

export interface CountryCreateData {
    name: string;
    code: string;
    flag?: string | null;
    dial_code: string;
    domain?: string | null;
    currency_code?: string;
    currency_symbol?: string;
    is_active?: boolean;
}

export interface DealerCreateData {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    company_name: string;
    registration_number?: string;
    tax_id?: string;
    company_address?: string;
    company_city?: string;
    company_state?: string;
    company_postal_code?: string;
    country_id: number;
    subscription_plan: 'demo' | 'premium' | 'lifetime';
    subscription_start?: string;
    subscription_end?: string | null;
    clients_limit: number;
}

export interface DealerUpdateData {
    country_id?: number;
    country_admin_id?: number;
    company_id?: number | null;
    subscription_plan?: 'demo' | 'premium';
    subscription_start?: string;
    subscription_end?: string;
    is_active?: boolean;
}

export interface ClientCreateData {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    company_name: string;
    registration_number?: string;
    tax_id?: string;
    company_address?: string;
    company_city?: string;
    company_state?: string;
    company_postal_code?: string;
    dealer_id: number;
    // Note: country_id removed - country is automatically set from dealer.country
    subscription_plan: 'demo' | 'premium' | 'lifetime';
    subscription_start?: string;
    subscription_end?: string | null;
    branch_limit: number;
    campaign_limit: number;

    enable_campaign?: boolean;
    enable_sms_marketing?: boolean;
    enable_email_marketing?: boolean;
    use_own_sms_gateway?: boolean;
    use_own_email_service?: boolean;
}

export interface ClientUpdateData {
    dealer_id?: number;
    company_id?: number | null;
    subscription_plan?: 'demo' | 'premium' | 'lifetime';
    subscription_start?: string;
    subscription_end?: string | null;
    is_active?: boolean;

    enable_campaign?: boolean;
    enable_sms_marketing?: boolean;
    enable_email_marketing?: boolean;
    use_own_sms_gateway?: boolean;
    use_own_email_service?: boolean;
}

export interface Branch {
    id: number;
    user: UserMinimal;
    client: number;
    client_data: Client;
    dealer: number;
    dealer_data: Dealer;
    country: number;
    country_data: Country;
    branch_name: string;
    branch_code: string;
    address: string;
    city: string;
    is_active: boolean;
    campaigns_count: number;
    created_at: string;
    updated_at: string;
}

export interface BranchCreateData {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    client_id: number;
    branch_name: string;
    branch_code: string;
    address?: string;
    city?: string;
}

export interface BranchUpdateData {
    branch_name?: string;
    branch_code?: string;
    address?: string;
    city?: string;
    is_active?: boolean;
}

export interface CountryAdmin {
    id: number;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    country: number;
    country_data: Country;
    is_active: boolean;
    dealers_count: number;
    created_at: string;
    updated_at: string;
}

export interface CountryAdminCreateData {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    country_id: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    current_page: number;
    page_size: number;
    results: T[];
}

// Campaign Types
export interface Campaign {
    id: number;
    name: string;
    description: string;
    campaign_type: 'scratch_card' | 'spin_wheel' | 'lucky_draw' | 'instant_win';
    campaign_type_display: string;
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
    status_display: string;
    start_date: string;
    end_date: string;
    unique_hash: string;
    qr_image: string;
    client_data: Client;
    dealer_data?: Dealer;
    country_data?: Country;
    branch_data?: Branch;
    applies_to_all_branches: boolean;
    total_scans: number;
    total_rewards: number;
    rewards_pending: number;
    rewards_redeemed: number;
    created_at: string;
    updated_at: string;
}

export interface CampaignStats {
    total: number;
    active: number;
    paused: number;
    completed: number;
    draft: number;
    cancelled: number;
}
