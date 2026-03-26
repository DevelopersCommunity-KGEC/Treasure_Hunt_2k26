import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '@/app/api/_config/connectDb';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function createRazorpayOrder(teamId: string): Promise<{ orderId: string; amount: number }> {
  const amount = Number(process.env.NEXT_PUBLIC_EVENT_FEES)*100;
  
  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${teamId}_${Date.now()}`,
    notes: {
      teamId,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return { orderId: order.id, amount };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Payment initiation failed');
  }
}

export async function verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
  const body = orderId + "|" + paymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');
    
  return expectedSignature === signature;
}


// export async function updateUserPaymentStatus(userId: string): Promise<boolean> {
//   try {
//     const {  = await connectDB();
//     const result = await db.collection('users').updateOne(
//       { _id: userId },
//       { $set: { paid: true } }
//     );
    
//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error updating user payment status:', error);
//     return false;
//   }
// }