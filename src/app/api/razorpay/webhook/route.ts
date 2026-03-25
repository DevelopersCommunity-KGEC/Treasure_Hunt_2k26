import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import Team from '../../_model/team.model';
import connectDB from '../../_config/connectDb';

const RazorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string(),
        status: z.string(),
        notes: z.object({
          teamId: z.string().optional(),
        }).optional(),
      }),
    }),
  }),
});

type WebhookEventHandler = (payload: any) => Promise<NextResponse>;

const eventHandlers: Record<string, WebhookEventHandler> = {
  'payment.authorized': async (payload) => {
    const teamId = payload.payment.entity.notes?.teamId;
    if (!teamId) {
      console.log("NO TEAM ID WAS FOUND IN PAYMENT")
      return NextResponse.json({},{status:200});

    }

    try {
      await Team.findOneAndUpdate(
        { teamId },
        { 
          hasPaid: true, 
          lastPaymentDate: new Date(),
          paymentStatus: payload.payment.entity.status,
          method : payload.payment.entity.method,
          contact : payload.payment.entity.contact,
          vpa : payload.payment.entity.vpa,
          amount : payload.payment.entity.amount,
          paymentId : payload.payment.entity.id
        },
        { new: true }
      );

      return NextResponse.json({},{status:200});

    } catch (error) {
      console.log('Payment authorization error', { teamId, error });
      return NextResponse.json({},{status:200});
    }
  },

  'payment.captured': async (payload) => {
    const teamId = payload.payment.entity.notes?.teamId;
    if (!teamId) {
      console.log("NO TEAM ID WAS FOUND IN PAYMENT")
      return NextResponse.json({},{status:200});
    }

    try {
      await Team.findOneAndUpdate(
        { teamId },
        { 
          hasPaid: true, 
          paymentStatus: payload.payment.entity.status,
          lastCaptureDate: new Date()
        },
        { new: true }
      );

      return NextResponse.json({},{status:200});
    } catch (error) {
      console.log('Payment capture error', { teamId, error });
      return NextResponse.json({},{status:200});
    }
  },

  'payment.failed': async (payload) => {
    const teamId = payload.payment.entity.notes?.userId;
    if (!teamId) {
      console.log("NO TEAM ID WAS FOUND IN PAYMENT")
      return NextResponse.json({},{status:200});
    }

    try {
      await Team.findOneAndUpdate(
        { teamId },
        { 
          hasPaid: false, 
          paymentStatus: payload.payment.entity.status,
          lastFailedPaymentDate: new Date()
        },
        { new: true }
      );

      return NextResponse.json({},{status:200});
    } catch (error) {
      console.log('Payment failure processing error', { teamId, error });
      return NextResponse.json({},{status:200});
    }
  },
};

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();
    // const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    // const signature = request.headers.get('x-razorpay-signature');

    // if (!webhookSecret || !signature) {
    //   console.log('Missing webhook configuration', { hasSecret: !!webhookSecret, hasSignature: !!signature });
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid webhook configuration' },
    //     { status: 200 }
    //   );
    // }

    const eventHandler = eventHandlers[body.event];
    if (eventHandler) {
      return await eventHandler(body.payload);
    }

    console.log('Unhandled webhook event', { event: body.event });
    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });

  } catch (error) {
    console.log('Webhook processing error', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}