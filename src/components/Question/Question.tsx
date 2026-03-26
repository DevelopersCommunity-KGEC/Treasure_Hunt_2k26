'use client'

import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import styles from './style.module.scss';

import Input from '../Input/Input';
import FetchingLoader from '../FetchingLoader/FetchingLoader';
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore';
import { localStorageUtil } from '@/utils/localStorage.util';

type QuestionProps = {
    question: string;
    imageUrl?: string;
    qrscanner?: boolean;
    code?: string;
    location?: string;
    questionId: string;
}

const Question = (props: QuestionProps) => {

    const removeLocalStorageItem = localStorageUtil.removeLocalStorageItem;

    const { questionId, question, imageUrl, qrscanner } = props;

    const router = useRouter();
    const teamLives = useTreasureHuntStore(store => store.numberOfLives)
    const teamId = useTreasureHuntStore(store => store.teamId)
    const qrCodeValue = useTreasureHuntStore(store => store.qrCodeValue)
    const setStoreState = useTreasureHuntStore(store => store.setStoreState)

    const [verifyingAnswer, setVerifyingAnswer] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [hint, setHint] = useState('');
    const [fetchingHint, setFetchingHint] = useState(false)


    const fetchHint = async () => {
        setFetchingHint(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/${questionId}?hint=true&teamId=${teamId}`);
            const data = await res.json();

            if (data.hint) {
                setHint(data.hint);
                setShowHintModal(true);
            } else {
                toast.error("No hint found.");
            }
        } catch (error) {
            console.error("Error fetching hint:", error);
            toast.error("Failed to fetch hint.");
        } finally{
            setFetchingHint(false)
        }
    };


    return (
        <>
            <div className={styles.main__question__container}>

                <div className='flex justify-between items-start'>
                    <div>
                        Lives: {teamLives} 
                        <p className='text-left'><button disabled={fetchingHint} onClick={fetchHint}>Hint ?</button></p>
                    </div>
                    <div>
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
                </div>

                <div>
                    {question && (
                    <p>
                        {question.replace(/\\n/g, '\n').split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            {line === '' ? <br /> : line}
                            <br />
                        </React.Fragment>
                        ))}
                    </p>
                    )}
                    {imageUrl &&
                        <div>
                            <Image src={imageUrl!} alt='Question' height={200} width={300} />
                        </div>
                    }
                </div>

                <div>
                    <p>Code: </p>
                    <div>
                        <Input type="text" value={qrCodeValue} disabled={false} required={true} placeholder='Enter the code' onChange={(e) => {
                            setStoreState({ qrCodeValue: e.target.value.replace(/\s+/g, '').toLowerCase() });
                        }} />
                    </div>
                </div>

                <div className={styles.scan__and__submit}>
                    {qrscanner ? (
                        qrCodeValue !== '' ? (
                            <div>
                                {
                                    verifyingAnswer ? <FetchingLoader /> : (
                                        <div className='w-[80%] gap-4 flex justify-center items-center'>
                                            <button onClick={handleCancelCode}>
                                                Cancel
                                            </button>
                                            <button onClick={handleSubmit}>
                                                Submit
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div className="text-center">
                                <button onClick={handleScanQR}>Scan QR</button>
                            </div>
                        )
                    ) : null}
                </div>
                    <p className="text-center">You can use hints only 3 times</p>
            </div>


            {showHintModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowHintModal(false)}>
                    <div className="bg-[#0e0e0c] flex flex-col items-center rounded-xl shadow-lg p-6 w-[80%] border-[1px] border-gray-400">
                        <h2 className="text-xl font-semibold mb-4 text-white">Hint :)</h2>
                        <p className="whitespace-pre-wrap text-white text-center">{hint}</p>
                        <div className="flex justify-end mt-4 w-full">
                        <button
                            className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded ml-auto"
                            onClick={() => setShowHintModal(false)}
                        >
                            Close
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

    function handleScanQR() {
        router.push('/scan');
    }

    function handleCancelCode() {
        setStoreState({
            qrCodeValue: ''
        })
    }

    async function handleSubmit() {
        try {
            setVerifyingAnswer(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
                method: 'POST',
                body: JSON.stringify({
                    teamId,
                    questionId: questionId,
                    answerCode: qrCodeValue
                })
            })

            if (res.ok) {
                const data = await res.json();
                const { currentQuestionStage, numberOfLives, isDisqualified } = data.body;

                setStoreState({
                    currentQuestionStage: currentQuestionStage,
                    numberOfLives: numberOfLives,
                    isDisqualified: isDisqualified,
                    nextQuestionId : data.body.nextQuestionId ?? ''
                })
                if (data.success) {
                    if (Number(data.body.currentQuestionStage) === -1) {
                        router.push('/complete')
                    } else {
                        toast.success('Off to the next one!!', { duration: 2500 })
                        router.push(`/${teamId}/question/${data.body.nextQuestionId}`)
                    }
                } else {
                    if (data.body.isDisqualified) {
                        router.push('/dead')
                    }
                    toast.error('Sorry you lost a life!!', { duration: 2500 })
                }
            }
        } catch (error) {
            console.log('Error', error)
        } finally {
            setVerifyingAnswer(false)
            setStoreState({
                qrCodeValue: ''
            })
        }
    }
}

export default Question