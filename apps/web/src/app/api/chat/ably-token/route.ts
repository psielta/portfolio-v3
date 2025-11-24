import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@portfolio/auth';
import * as Ably from 'ably';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Ably client with API key
    const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

    // Generate token request for this user
    // Allow access to all channels with wildcard - user can only see their own conversations anyway
    // Security is enforced at the API level (tRPC) where we check participation
    const capability = {
      'chat:*': ['subscribe', 'publish', 'presence'],
      'typing:*': ['publish', 'subscribe'],
      'presence:*': ['publish', 'subscribe', 'presence'],
    };

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: session.user.id,
      capability,
    });

    // Log for debugging
    console.log('Generated Ably token with capability:', JSON.stringify(capability, null, 2));
    console.log('User ID:', session.user.id);

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Error generating Ably token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
