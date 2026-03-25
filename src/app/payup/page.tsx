/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import PaymentButton from '../../components/PaymentButton';
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTeamId } from '@/utils/localStorage.util';

const PayupPage = () => {

   const router = useRouter()

    //  const hasHydrated = typeof window !== 'undefined' 
    // ? useTreasureHuntStore.persist.hasHydrated() 
    // : false;

  //  const hasHydrated = useTreasureHuntStore.persist.hasHydrated();
   const teamId = useTreasureHuntStore(store => store.teamId)
      const setStoreState = useTreasureHuntStore(store =>
    store.setStoreState
   )
   const teamName = useTreasureHuntStore(store => store.teamName)
   const hasPaid = useTreasureHuntStore(store => store.hasPaid)
   const currentQuestionStage= useTreasureHuntStore(store => store.currentQuestionStage)
   const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useTreasureHuntStore.persist.hasHydrated());
  }, []);

  useEffect(() =>{
    if(!hasHydrated) return

    if(currentQuestionStage >=0){
        if(!hasPaid) {
            router.push('/payup');
            return;
        }
         if(currentQuestionStage === 0 ) {router.replace('/startup');return;}
      router.replace(`/${teamId}/question/q${currentQuestionStage}`)
    }

  },[hasHydrated])

  useEffect(()=> {
    const fetchPaymentStatus = async() => {

      const teamId = getTeamId();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/${teamId}`);
      if(res.ok) {
        const data = await res.json();

        if(data.data.hasPaid){
          setStoreState({
            hasPaid : data.data.hasPaid
          })
          router.push('/startup')}
      }
    }

    fetchPaymentStatus();
  },[])
  
  return (
    <div className={styles.main__container}>
      <div className="max-w-md w-full mx-auto">
        <div className="p-8">
          <h1 className="text-center text-2xl font-bold text-gray-400 mb-6">
            Complete Your Subscription
          </h1>
          
          <div className="mb-8">
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex justify-between text-lg font-medium">
                <p>One-time Subscription Fee</p>
                <p>₹{process.env.NEXT_PUBLIC_EVENT_FEES}.00</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Unlock full access to all features of our platform
              </p>
            </div>
            
            <div className="border-b border-gray-200 py-6">
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>₹{process.env.NEXT_PUBLIC_EVENT_FEES}.00</p>
              </div>
            </div>
          </div>
          
          <PaymentButton teamName={teamName} />
        </div>
      </div>
    </div>
  );
}

export default PayupPage;
