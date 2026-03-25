'use client'

import React, { useState } from 'react'
import styles from './style.module.scss';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QrScanner/QrScanner';
import { toast } from 'sonner';
import { z } from 'zod';
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';

const dataValidator = z.string().min(2)

const Scan = () => {

  const router = useRouter()
  const teamId = useTreasureHuntStore(store => store.teamId)
  const  currentQuestionStage = useTreasureHuntStore(store => store.currentQuestionStage)
  const setStoreState = useTreasureHuntStore(store => store.setStoreState)


  const [qrData, setQRData] = useState<string>('');

  const handleScan = (data: string) => {
    setQRData(data);

    const dataValidated = dataValidator.safeParse(data);

    if(data && dataValidated.success)
    navigator.clipboard.writeText(data);
    toast.success('Copied to clipboard',{
      duration: 1000
    });
    setStoreState({
      qrCodeValue: data
    })
    router.push(`${teamId}/question/q${currentQuestionStage}`);
    return;
  };
    
  return (
    <div className={styles.main__container}>
        <QRScanner onScan={handleScan}/>
        <div>
          <p>Scanned Code :</p>
          <p>{qrData}</p>
        </div>
    </div>
  )
}

export default Scan