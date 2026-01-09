import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || !session.user) {
      return NextResponse.json({
        user: null,
        isLoggedIn: false,
      });
    }

    // Return user info (but not tokens for security)
    return NextResponse.json({
      user: session.user,
      isLoggedIn: session.isLoggedIn,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching session' },
      { status: 500 }
    );
  }
}
