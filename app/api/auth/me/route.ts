import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch fresh user data from Django backend
    const response = await axios.get(`${API_BASE_URL}/accounts/user/`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    const freshUserData = response.data;

    // Update session with fresh user data
    session.user = freshUserData;
    await session.save();

    return NextResponse.json(freshUserData);
  } catch (error: any) {
    console.error('Error fetching current user:', error);

    if (error.response?.status === 401) {
      // Token expired, clear session
      const cookieStore = await cookies();
      const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
      session.destroy();

      return NextResponse.json(
        { error: 'Authentication expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
