import {axiosClient, clearCachedToken} from './axios-client';
import {User} from './session';

/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Login response from our API
 */
export interface LoginResponse {
    user: User;
    success: boolean;
}

/**
 * Session response
 */
export interface SessionResponse {
    user: User | null;
    isLoggedIn: boolean;
}

/**
 * Auth service for handling authentication operations
 */
export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        clearCachedToken();
        const response = await axiosClient.post<LoginResponse>('/api/auth/login', credentials);
        return response.data;
    },

    async logout(): Promise<void> {
        clearCachedToken();
        await axiosClient.post('/api/auth/logout');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    async getSession(): Promise<SessionResponse> {
        const response = await axiosClient.get<SessionResponse>('/api/auth/session');
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const session = await this.getSession();
        if (!session.user) {
            throw new Error('Not authenticated');
        }
        return session.user;
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await axiosClient.post('/api/auth/change-password/', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: newPassword,
        });
    },

    async updateProfile(data: Partial<Pick<User, 'first_name' | 'middle_name' | 'last_name' | 'phone'>>): Promise<User> {
        const response = await axiosClient.patch<User>('/api/user/', data);
        return response.data;
    },
};

export type {User};
