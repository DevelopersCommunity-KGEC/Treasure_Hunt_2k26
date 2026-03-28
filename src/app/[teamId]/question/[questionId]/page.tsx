/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import Question from '@/components/Question/Question'

// import Loader from '@/components/Loader/Loader'

import styles from './style.module.scss'
import GridContainer from '@/components/GridContainer/GridContainer'
import useTreasureHuntStore from '@/hooks/useTreasureHuntStore'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader'

type PageType = {
  params: {
    questionId: string
    teamId: string
  }
}


const QuestionPage = ({ params }: PageType) => {

  const router = useRouter()
  const pathname = usePathname()

  const [fetchingQuestion, setFetchingQuestion] = useState(false);
  const [questionInfo, setQuestionInfo] = useState<{
    question: string,
    questionId: string,
    questionImage: string
  }>();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useTreasureHuntStore.persist.hasHydrated());
  }, []);
  const currentQuestionStage = useTreasureHuntStore(store => store.currentQuestionStage)
  const teamId = useTreasureHuntStore(store => store.teamId)
  const nextQuestionId = useTreasureHuntStore(store => store.nextQuestionId);
  const isDisqualified = useTreasureHuntStore(store => store.isDisqualified);
  const setStoreState = useTreasureHuntStore((store) => store.setStoreState);

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchQuestion = async () => {
      setFetchingQuestion(true);

      if (isDisqualified) {
        setFetchingQuestion(false);
        router.replace('/dead')
        return;
      } else if (currentQuestionStage === -1) {
        setFetchingQuestion(false);
        router.replace('/complete')
        return;
      } else if (nextQuestionId && params.questionId !== nextQuestionId) {
        setFetchingQuestion(false);
        router.replace(`/${teamId}/question/${nextQuestionId}`)
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/${params.questionId}`);

        if (res.ok) {
          const data = await res.json();
          // console.log("THE DATA", data)

          if (data.data) {
            const { _v, __id, updatedAt, createdAt, ...rest } = data.data;

            setQuestionInfo(rest);
          }

        }
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setFetchingQuestion(false);
      }
    };

    fetchQuestion();
  }, [hasHydrated]);

  return (
    <GridContainer>
      <div className={styles.main__container}>
        {
          fetchingQuestion ? (
            <div>
              {/* <Loader /> */}
              <FetchingLoader />
            </div>
          ) : (
            <>
              <Question question={questionInfo?.question as string} imageUrl={questionInfo?.questionImage as string} questionId={params.questionId} qrscanner={true} />
            </>
          )
        }
      </div>
    </GridContainer>
  )
}

export default QuestionPage