import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosError} from 'axios';
import {SessionData, sessionOptions} from "@/lib/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

let cachedAccessToken: string | null = null;

async function getAccessTokenClient(): Promise<string | null> {
    if (cachedAccessToken) {
        return cachedAccessToken;
    }

    try {
        const tokenResponse = await axios.get('/api/auth/token', {
            withCredentials: true
        });
        cachedAccessToken = tokenResponse.data.accessToken;
        return cachedAccessToken;
    } catch {
        return null;
    }
}

async function getAccessTokenServer(): Promise<string | null> {
    try {
        const {cookies} = await import('next/headers');
        const {getIronSession} = await import('iron-session');

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!session.isLoggedIn || !session.accessToken) {
            return null;
        }

        return session.accessToken;
    } catch {
        return null;
    }
}

async function getAccessToken(): Promise<string | null> {
    return typeof window === 'undefined'
        ? getAccessTokenServer()
        : getAccessTokenClient();
}

async function refreshTokenClient(): Promise<boolean> {
    try {
        clearCachedToken();
        await axios.post('/api/auth/refresh', {}, {withCredentials: true});
        return true;
    } catch {
        return false;
    }
}

async function refreshTokenServer(): Promise<boolean> {
    try {
        const {cookies} = await import('next/headers');
        const {getIronSession} = await import('iron-session');
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!session.refreshToken) {
            return false;
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: session.refreshToken,
        });

        session.accessToken = response.data.access;
        await session.save();
        return true;
    } catch (error) {
        console.error('Server token refresh failed:', error);

        try {
            const {cookies} = await import('next/headers');
            const {getIronSession} = await import('iron-session');

            const cookieStore = await cookies();
            const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
            session.user = undefined;
            session.accessToken = undefined;
            session.refreshToken = undefined;
            session.isLoggedIn = false;
            await session.save();
        } catch {}

        return false;
    }
}

async function refreshToken(): Promise<boolean> {
    return typeof window === 'undefined'
        ? refreshTokenServer()
        : refreshTokenClient();
}

export function clearCachedToken() {
    cachedAccessToken = null;
}

const createUniversalAxios = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000,
        withCredentials: typeof window !== 'undefined',
    });

    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            if (config.url?.startsWith('/api/')) {
                config.baseURL = '';
                return config;
            }

            const accessToken = await getAccessToken();

            if (accessToken && config.headers) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const refreshSuccess = await refreshToken();

                if (refreshSuccess) {
                    return instance(originalRequest);
                } else {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }
            }

            // Handle 403 Forbidden - permissions changed
            if (error.response?.status === 403 && typeof window !== 'undefined') {
                console.log('[Axios] 403 error detected, dispatching permission-denied event');
                // Trigger custom event to refresh user data
                window.dispatchEvent(new CustomEvent('permission-denied'));
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const axiosClient = createUniversalAxios();