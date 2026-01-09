import {SessionOptions} from 'iron-session';

export interface User {
    id: number;
    email: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone?: string;
    role: 'superadmin' | 'countryadmin' | 'dealer' | 'client' | 'branch' | 'staff';
    is_active: boolean;
    country?: {
        id: number;
        name: string;
        code: string;
    };
    client: {
        enable_campaign: boolean;
        enable_sms_marketing: boolean;
        enable_email_marketing: boolean;
        use_own_sms_gateway: boolean;
        use_own_email_service: boolean;
    };
    permissions: string[];
    is_client_user: boolean;
    is_countryadmin: boolean;
    is_dealer: boolean;
    is_staff: boolean;
    is_superadmin: boolean;
}

export interface SessionData {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_change_this_in_production',
    cookieName: 'oreqs_session',
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    },
};
