import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import Team from '../../_model/team.model';

export async function POST(req: NextRequest) {
  try {
    // const user = await getUserFromToken();
    const body = await req.json()
    const teamId = body.teamId

    const team = await Team.findOne({teamId : teamId})
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (team.hasPaid) {
      return NextResponse.json(
        { success: false, error: 'User has already paid' },
        { status: 400 }
      );
    }
    
    const { orderId, amount } = await createRazorpayOrder(teamId);

    team.orderId = orderId;
    team.orderValue = Number(amount);

    await team.save()
    
    return NextResponse.json({
      success: true,
      orderId,
      amount,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}