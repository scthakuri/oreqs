import {NextRequest, NextResponse} from 'next/server';
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {sessionOptions, SessionData} from '@/lib/session';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!session.refreshToken) {
            return NextResponse.json(
                {error: 'No refresh token available'},
                {status: 401}
            );
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: session.refreshToken,
        });

        session.accessToken = response.data.access;
        await session.save();

        return NextResponse.json({
            success: true,
            accessToken: response.data.access,
        });
    } catch (error) {
        console.error('Token refresh error:', error);

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
        session.user = undefined;
        session.accessToken = undefined;
        session.refreshToken = undefined;
        session.isLoggedIn = false;
        await session.save();

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                {error: error.response.data?.error || 'Token refresh failed'},
                {status: error.response.status}
            );
        }

        return NextResponse.json(
            {error: 'Token refresh failed'},
            {status: 401}
        );
    }
}