import {NextRequest, NextResponse} from 'next/server';
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {sessionOptions, SessionData} from '@/lib/session';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!session.isLoggedIn || !session.accessToken) {
            return NextResponse.json(
                {error: 'Not authenticated'},
                {status: 401}
            );
        }

        return NextResponse.json({
            accessToken: session.accessToken,
        });
    } catch (error) {
        console.error('Token retrieval error:', error);
        return NextResponse.json(
            {error: 'An error occurred while retrieving token'},
            {status: 500}
        );
    }
}
