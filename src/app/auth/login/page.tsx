'use client'

import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { FormType } from '@/types/form.type'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore'
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader'
import { toast } from 'sonner'

type UserLoginFormType = z.infer<typeof FormType.UserLoginForm>

const Login = () => {

    const router = useRouter();
    //  const hasHydrated = typeof window !== 'undefined' 
    // ? useTreasureHuntStore.persist.hasHydrated() 
    // : false;

    //    const hasHydrated = useTreasureHuntStore.persist.hasHydrated();
    const teamId = useTreasureHuntStore(store => store.teamId)
    const setStoreState = useTreasureHuntStore(store =>
        store.setStoreState
    )
    const hasPaid = useTreasureHuntStore(store => store.hasPaid)
    const currentQuestionStage = useTreasureHuntStore(store => store.currentQuestionStage)
    const nextQuestionId = useTreasureHuntStore(store => store.nextQuestionId)
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(useTreasureHuntStore.persist.hasHydrated());
    }, []);


    useEffect(() => {
        if (!hasHydrated) return

        if (currentQuestionStage >= 0) {
            if (!hasPaid) {
                router.push('/payup');
                return;
            }
            if (currentQuestionStage === 0) { router.push('/startup'); return; }
            if (teamId && nextQuestionId) {
                router.replace(`/${teamId}/question/${nextQuestionId}`)
            }
        }

    }, [hasHydrated, router, currentQuestionStage, teamId, hasPaid, nextQuestionId])

    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            teamId: teamId,
        }
    })

    return (
        <div className={styles.main__container}>
            <form onSubmit={handleSubmit(onSubmitForm)} className={styles.user__longin__form}>
                <div>
                    <label htmlFor="">TeamId</label>
                    <input {...register('teamId', {
                        required: 'Please enter the team id to continue'
                    })} />
                </div>
                {isSubmitting ? (
                    <div className='flex justify-center items-center'>
                        <FetchingLoader />
                    </div>
                ) : (
                    <button type='submit'>Lets go!!</button>
                )}
            </form>

            <div className='fixed bottom-0 p-8'>
                <p className='text-sm mb-[1rem]'>Didnt register yet?? Dont miss out on the fun</p>
                <button className={styles.button__general} onClick={() => {
                    router.push('/auth/register')
                }}>Register Now!!</button>
            </div>
        </div>
    )

    async function onSubmitForm(data: UserLoginFormType) {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status === 401) {
                router.push('/auth/register');
                return;
            }

            if (res.status === 302) {
                if (res.statusText.toLowerCase() === 'completed') {
                    router.push('/complete');
                } else {
                    router.push('/dead');
                }
                return;
            }

            const resData = await res.json();

            if (resData.data.isLoggedIn) {
                toast.error('Already logged in on another device', { duration: 2500 });
                return;
            }

            setStoreState({
                teamName: resData.data.teamName,
                teamId: resData.data.teamId,
                currentQuestionStage: resData.data.currentQuestionStage,
                numberOfLives: resData.data.numberOfLives,
                hasPaid: resData.data.hasPaid,
                nextQuestionId: resData.data.nextQuestionId,
            });

            if (resData.data.currentQuestionStage > 0 && resData.data.nextQuestionId) {
                router.push(`/${resData.data.teamId}/question/${resData.data.nextQuestionId}`);
                return;
            }

            if (!resData.data.hasPaid) {
                router.push('/payup');
            } else {
                router.push('/startup');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }
}

export default Login