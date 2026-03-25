import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body correctly
    const body = await req.json();
    
    console.log('Payment callback received:', body);

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = body;

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment data' }, 
        { status: 400 }
      );
    }

    // Verify the payment signature using Razorpay secret
    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
      console.error('Razorpay secret is not configured');
      return NextResponse.json(
        { error: 'Payment verification failed' }, 
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' }, 
        { status: 400 }
      );
    }

    // Payment is verified
    // In a real-world scenario, you'd typically:
    // 1. Update payment status in your database
    // 2. Update team or user status
    
    // For PWA redirection, we'll return a success response
    return NextResponse.json(
      { 
        success: true, 
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/startup?payment=success` 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in Razorpay callback:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}