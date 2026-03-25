'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({ teamName }: { teamName: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const teamId = useTreasureHuntStore(store => store.teamId)

  const initializePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/razorpay/create`, {
        method: 'POST',
        body : JSON.stringify({
            teamId
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // const returnUrl = `${window.location.origin}/payup`;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Treasure Hunt',
        description: 'Labyrinth Event Fees',
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                teamId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });
            
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              router.push('/startup');
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            setError('Payment verification failed');
          }
        },
        redirect : true,
        // callback_url: `${process.env.NEXT_PUBLIC_API_URL}/razorpay/callback`,
        prefill: {
          name: teamName,
        },
        method: {
          netbanking: false,
          card: false,
          upi: true,
          wallet: false,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setError('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
      />
      
      <div className="w-full max-w-md mx-auto text-center">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={initializePayment}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Processing...' : `Pay ₹${process.env.NEXT_PUBLIC_EVENT_FEES}`}
        </button>
        
        <p className="mt-4 text-gray-600 text-sm">
          Secure payment powered by Razorpay
        </p>
      </div>
    </>
  );
}

