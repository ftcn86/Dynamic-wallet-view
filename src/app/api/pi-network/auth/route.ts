import { NextRequest, NextResponse } from 'next/server';
import { initializePiNetwork, getPiSDK } from '@/lib/pi-network';

// Initialize Pi Network with server-side credentials
const piConfig = {
  appId: process.env.PI_APP_ID || '',
  apiKey: process.env.PI_API_KEY || '',
  sandbox: process.env.PI_SANDBOX === 'true',
};

// Initialize Pi Network SDK
initializePiNetwork(piConfig);

// Helper function to validate token with Pi Network API
async function validateTokenWithPiAPI(accessToken: string): Promise<boolean> {
  try {
    const api = new (await import('@/lib/pi-network')).PiNetworkAPI(piConfig);
    return await api.validateToken(accessToken);
  } catch (error) {
    console.error('Pi API token validation failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'authenticate':
        try {
          const sdk = getPiSDK();
          
          // For server-side authentication, we need to handle this differently
          // since the Pi SDK is primarily client-side
          return NextResponse.json({
            success: true,
            message: 'Authentication should be handled client-side with Pi Browser',
            config: {
              appId: piConfig.appId,
              sandbox: piConfig.sandbox,
            }
          });
        } catch (error) {
          console.error('Pi Network authentication error:', error);
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
          );
        }

      case 'validate-token':
        try {
          const { accessToken } = await request.json();
          
          if (!accessToken) {
            return NextResponse.json(
              { error: 'Access token required' },
              { status: 400 }
            );
          }

          // For sandbox mode, we'll accept the token as valid
          // since Pi Network sandbox doesn't provide the same validation endpoints
          const isValid = piConfig.sandbox ? true : await validateTokenWithPiAPI(accessToken);

          console.log(`🔍 Token validation: ${isValid ? 'VALID' : 'INVALID'} (sandbox: ${piConfig.sandbox})`);

          return NextResponse.json({
            success: true,
            isValid,
            sandbox: piConfig.sandbox,
          });
        } catch (error) {
          console.error('Token validation error:', error);
          return NextResponse.json(
            { error: 'Token validation failed' },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: authenticate or validate-token' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Pi Network API error:', error);
    return NextResponse.json(
      { error: 'Pi Network operation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Pi Network API is available',
    config: {
      appId: piConfig.appId ? 'configured' : 'not configured',
      sandbox: piConfig.sandbox,
    }
  });
} 