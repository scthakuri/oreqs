import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {sessionOptions, SessionData} from '@/lib/session';
import axios, {AxiosInstance} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getServerAxios(): Promise<AxiosInstance> {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });

    instance.interceptors.request.use(
        (config) => {
            if (session.accessToken && config.headers) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
}

export async function serverApiGet<T>(endpoint: string): Promise<T> {
    const client = await getServerAxios();
    const response = await client.get<T>(endpoint);
    return response.data;
}

export async function serverApiPost<T>(endpoint: string, data?: unknown): Promise<T> {
    const client = await getServerAxios();
    const config = data instanceof FormData
        ? {headers: {'Content-Type': 'multipart/form-data'}}
        : undefined;
    const response = await client.post<T>(endpoint, data, config);
    return response.data;
}

export async function serverApiPut<T>(endpoint: string, data?: unknown): Promise<T> {
    const client = await getServerAxios();
    const config = data instanceof FormData
        ? {headers: {'Content-Type': 'multipart/form-data'}}
        : undefined;
    const response = await client.put<T>(endpoint, data, config);
    return response.data;
}

export async function serverApiPatch<T>(endpoint: string, data?: unknown): Promise<T> {
    const client = await getServerAxios();
    const config = data instanceof FormData
        ? {headers: {'Content-Type': 'multipart/form-data'}}
        : undefined;
    const response = await client.patch<T>(endpoint, data, config);
    return response.data;
}

export async function serverApiDelete<T>(endpoint: string): Promise<T> {
    const client = await getServerAxios();
    const response = await client.delete<T>(endpoint);
    return response.data;
}
