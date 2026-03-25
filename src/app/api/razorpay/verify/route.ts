import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/razorpay';
import Team from '../../_model/team.model';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const teamId = body.teamId;

    const team = await Team.findOne({teamId : teamId})
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { paymentId, orderId, signature } = body;
    
    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification details' },
        { status: 400 }
      );
    }
    
    const isValid = await verifyPayment(paymentId, orderId, signature);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    team.hasPaid = true;
    await team.save();
        
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}