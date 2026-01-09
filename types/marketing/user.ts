export interface MarketingUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    full_name: string;
    is_active: boolean;
    groups: number[];
    created_at: string;
    updated_at: string;
}

export interface MarketingUserCreateData {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    group_ids?: number[];
}

export interface MarketingUserUpdateData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    is_active?: boolean;
    group_ids?: number[];
}
