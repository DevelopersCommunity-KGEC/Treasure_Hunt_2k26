'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import styles from './style.module.scss'

import devcommunityImg from '@/assets/images/devcommunity.png';
import infinitioImg from '@/assets/images/infinitio.jpeg';
import harryImg from  '@/assets/images/harry.png'
import labyrinthImg from '@/assets/images/labyrinth.png'

import InstallPWAButton from '@/components/InstallPWAButton/InstallPWAButton'
import { useRouter } from 'next/navigation';
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader';

import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';
import { toast } from 'sonner';

const Home = () => {

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const router = useRouter();

  const teamId = useTreasureHuntStore(store => store.teamId)
  const teamName = useTreasureHuntStore(store => store.teamName)
  const setStoreState = useTreasureHuntStore(store => store.setStoreState)

  return (
    <div className={styles.main__container}>
      <div className='flex justify-center items-center'>
        <InstallPWAButton />
      </div>
      <div>
        <div>
          {/* <p>ESPEKTRO</p> */}
          <Image src={labyrinthImg} className='z-[100000]' alt='Labyrinth' width={200} height={200} />
        </div>
        <div>
          <Image src={harryImg} className='z-[100000]' alt='Harry' width={400} height={400} />
        </div>
        <div>
          <div>
            {isLoading ? (
              <div className='flex justify-center items-center'>
                <FetchingLoader />
              </div>
            ) : (
              <button onClick={startGame} className='px-4 py-2 text-white rounded-md'>
                Espektro Petronum
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center flex-col gap-8 p-8 pt-0">
        <div>
          <p className='text-xl'>Presented By</p>
        </div>
        <div className='flex justify-center items-center gap-4'>
          <div className='flex flex-col justify-center items-center'>
            <Image src={devcommunityImg} alt='Techtix' height={50} className='rounded-full' />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image src={infinitioImg} alt='Infinitio' height={50} className='rounded-full' />
          </div>
        </div>
      </div>
    </div>
  )

  async function startGame() {

    setIsLoading(true);

    if (teamId === '' && teamName === '') {

      router.push('/auth/login');
      return;
    } else {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/${teamId}`)
        if (res.status === 404) {
           setStoreState({
            teamName: '',
            teamId: '',
            currentQuestionStage: -1,
            numberOfLives: 0,
            qrCodeValue: '',
            hasPaid : false,
            isDisqualified : false,
            nextQuestionId : '',
           })
            router.push('/auth/register');
            return;
        }
        if (res.ok) {
          const data = await res.json();
          setStoreState({
            hasPaid: data.data.hasPaid,
            numberOfLives: data.data.numberOfLives,
            currentQuestionStage: data.data.currentQuestionStage,
            isDisqualified: data.data.isDisqualified,
            nextQuestionId : data.data.nextQuestionId
          })

          if (data.data.isDisqualified) {
            router.push('/dead')
          } else if (!data.data.hasPaid) {
            router.push('/payup')
          } else if (data.data.currentQuestionStage === 0) {
            router.push('/startup');
          } else if (data.data.currentQuestionStage === -1) {
            router.push('/complete')
          } else {
            router.push(`/${data.data.teamId}/question/${data.data.nextQuestionId}`)
          }
        }
      } catch (error) {
        toast.error("Something went very wrong!!")
        console.log("Error", error)
      } finally {
        setIsLoading(false);
      }
    }
  }

}

export default Home