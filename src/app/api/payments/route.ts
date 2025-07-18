import { NextRequest, NextResponse } from 'next/server';
import { 
  createPiPayment, 
  completePiPayment, 
  cancelPiPayment, 
  getUserPaymentHistory 
} from '@/services/piService';
import type { PiPaymentData } from '@/lib/pi-network';

/**
 * Payments API Endpoint
 * 
 * This endpoint handles Pi Network payment operations:
 * - Create new payments
 * - Complete payments
 * - Cancel payments
 * - Get payment history
 */

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const { action, paymentData, payment } = await request.json();

    switch (action) {
      case 'create':
        if (!paymentData) {
          return NextResponse.json(
            { error: 'Payment data is required' },
            { status: 400 }
          );
        }

        const newPayment = await createPiPayment(paymentData as PiPaymentData);
        return NextResponse.json({
          success: true,
          payment: newPayment,
        });

      case 'complete':
        if (!payment) {
          return NextResponse.json(
            { error: 'Payment object is required' },
            { status: 400 }
          );
        }

        const completedPayment = await completePiPayment(payment);
        return NextResponse.json({
          success: true,
          payment: completedPayment,
        });

      case 'cancel':
        if (!payment) {
          return NextResponse.json(
            { error: 'Payment object is required' },
            { status: 400 }
          );
        }

        const cancelledPayment = await cancelPiPayment(payment);
        return NextResponse.json({
          success: true,
          payment: cancelledPayment,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create, complete, or cancel' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Payment operation error:', error);
    return NextResponse.json(
      { error: 'Payment operation failed' },
      { status: 500 }
    );
  }
}

/**
 * Get payment history
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    const transactions = await getUserPaymentHistory(sessionToken);

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('Payment history fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
} 