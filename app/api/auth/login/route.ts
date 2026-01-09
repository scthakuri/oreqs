import {NextRequest, NextResponse} from 'next/server';
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {sessionOptions, SessionData} from '@/lib/session';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {email, password} = body;

        if (!email || !password) {
            return NextResponse.json(
                {error: 'Email and password are required'},
                {status: 400}
            );
        }

        const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
            email,
            password,
        });

        const {user, tokens} = response.data;

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        session.user = user;
        session.accessToken = tokens.access;
        session.refreshToken = tokens.refresh;
        session.isLoggedIn = true;

        await session.save();
        return NextResponse.json({
            user,
            success: true,
        });
    } catch (error) {
        console.error('Login error:', error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                {error: error.response.data?.error || 'Invalid credentials'},
                {status: error.response.status}
            );
        }

        return NextResponse.json(
            {error: 'An error occurred during login'},
            {status: 500}
        );
    }
}
