/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import styles from './style.module.scss'

import { toast } from 'sonner'
import Input from '@/components/Input/Input'
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore'
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader'
import { localStorageUtil } from '@/utils/localStorage.util'


const StartUp = () => {

  const router = useRouter();
  const removeLocalStorageItem = localStorageUtil.removeLocalStorageItem;
  const teamName = useTreasureHuntStore(store => store.teamName)
  const teamId = useTreasureHuntStore(store => store.teamId)
  const currentQuestionStage = useTreasureHuntStore(store => store.currentQuestionStage)
  const setStoreState = useTreasureHuntStore(store => store.setStoreState)
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  // const hasHydrated = typeof window !== 'undefined'
  // ? useTreasureHuntStore.persist.hasHydrated()
  // : false;
  const hasPaid = useTreasureHuntStore(store => store.hasPaid)
  const nextQuestionId = useTreasureHuntStore(store => store.nextQuestionId)

  // const hasHydrated = useTreasureHuntStore.persist.hasHydrated();

  const [initialPuzzleAnswer, setInitialPuzzleAnswer] = React.useState<string>('');
  const [hasHydrated, setHasHydrated] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);


  useEffect(() => {
    setHasHydrated(useTreasureHuntStore.persist.hasHydrated());
  }, []);

  useEffect(() => {
    if (!hasHydrated) return

    if (!teamId || !teamName) {
      router.replace('/auth/login')
      return;
    }

    if (currentQuestionStage > 0) {
      // else if(!hasPaid)router.replace('/payup')
      if (nextQuestionId) {
        router.replace(`/${teamId}/question/${nextQuestionId}`)
      } else {
        router.replace('/auth/login')
      }
    }
  }, [hasHydrated])

  const handleStartHunt = async () => {

    if (initialPuzzleAnswer.length === 0) {
      toast.info('Field cannot be empty', { duration: 1500 });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startup`, {
        method: 'POST',
        body: JSON.stringify({
          answer: initialPuzzleAnswer,
          teamId
        })
      })

      if (res.ok) {
        const data = await res.json();
        setStoreState({
          currentQuestionStage: data.currentQuestionStage,
          numberOfLives: data.numberOfLives,
          nextQuestionId: data.nextQuestionId
        })
        if (data.currentQuestionStage === -1) {
          router.push('/complete');
        } else if (data.nextQuestionId) {
          router.push(`/${teamId}/question/${data.nextQuestionId}`);
        } else {
          toast.error('Unable to start hunt. Please try logging in again.', { duration: 2500 });
        }
      } else {
        toast.error('Wrong Answer', { duration: 2500 });
      }
    } catch (error) {
      console.log("Error", error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.main__container}>
      <div className='w-full flex justify-end items-center p-4 top-0 right-0 absolute text-lg'>
        <button disabled={loggingOut} onClick={async () => {
          setLoggingOut(true);

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/${teamId}/logout`, {
              method: 'POST',
            })

            if (res.ok) {
              removeLocalStorageItem('treasure-hunt-storage');
              setStoreState({
                teamName: '',
                teamId: '',
                currentQuestionStage: -1,
                numberOfLives: 0,
                qrCodeValue: '',
                hasPaid: false,
                isDisqualified: false,
                nextQuestionId: ''
              });
              router.push('/')
              toast.success('Logged out successfully', { duration: 2000 })
            }
          } catch (error) {
            toast.success('Error logging out', { duration: 2000 })
          } finally {
            setLoggingOut(false)
          }
        }}>
          Logout
        </button>
      </div>
      <div className={styles.team__name}>
        <p>Pirate #{teamId}</p>
        <p className={styles.name}>{teamName}</p>
      </div>

      <div>
        <div className={styles.start__event}>
          <p>Answer the puzzle and have fun!!</p>
        </div>

        <div className={styles.answer__container}>
          <Input
            type='text'
            placeholder='We r rooting for U'
            value={initialPuzzleAnswer}
            onChange={(e) => setInitialPuzzleAnswer(e.target.value.replace(/\s/g, ''))}
            required={true} />
          {isLoading ? (
            <FetchingLoader />
          ) : (
            <button disabled={process.env.NEXT_PUBLIC_GAME_DISABLED === 'true'} onClick={handleStartHunt}>Start Hunt</button>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default StartUp