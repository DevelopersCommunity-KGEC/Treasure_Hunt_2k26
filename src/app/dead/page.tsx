"use client";
import React, { useState } from 'react'
import styles from './style.module.scss';
import { localStorageUtil } from '@/utils/localStorage.util';
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import deadVid from '@/assets/video/dead.gif'
import Image from 'next/image'

const LivesOut = () => {

  const router = useRouter();

  const removeLocalStorageItem = localStorageUtil.removeLocalStorageItem;
  const setStoreState = useTreasureHuntStore(store => store.setStoreState)
  const teamId = useTreasureHuntStore(store => store.teamId)

  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <div className={styles.main__container}>
      <div className='w-full flex justify-end items-center p-4 top-0 right-0 absolute text-lg'>
        <button disabled={loggingOut} onClick={async() => {
          setLoggingOut(true);

          try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/${teamId}/logout`,{
            method: 'POST',
          })
            
          if(res.ok){
            removeLocalStorageItem('treasure-hunt-storage');
            setStoreState({
                teamName: '',
                teamId: '',
                currentQuestionStage: -1,
                numberOfLives: 0,
                qrCodeValue: '',
                hasPaid: false,
                isDisqualified: false,
                nextQuestionId : ''
            });
            router.push('/')
            toast.success('Logged out successfully',{duration: 2000})
          }
          } catch (error) {
              toast.success('Error logging out',{duration : 2000})
          } finally{
            setLoggingOut(false)
          }
        }}>
          Logout
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <Image
          src={deadVid}
          alt="Celebration GIF"
          className="w-[85%] h-auto mx-auto rounded-xl"
        />
      </div>
      <h1>Sorry you are out of lives</h1>
      <p>Try again next time!!!</p>
      <div>
        <Link href={'/leaderboard'}>
          <button className={styles.button__general}>LeaderBoard</button>
        </Link>
      </div>
    </div>
  )
}

export default LivesOut