'use client';

import React, { useEffect, useState } from 'react'

import styles from './style.module.scss';
// import { useGetLeaderboard } from '@/query/api/user.service';
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader';
import { useSearchParams } from 'next/navigation';

type T_TeamDisplay = {
    teamName : string,
    teamId: string,
    currentQuestionStage: number,
    lastStageUpdate: string,
}

const LeaderBoard = () => {

    const [fetchingLeaderBoard, setFetchingLeaderBoard] = useState(false);
    const [leaderBoardData, setLeaderBoardData] = useState<T_TeamDisplay[]>([]);

//   const getLeaderBoard = useGetLeaderboard();
  useEffect(() => {
    const fetchLeaderBoard = async() => {
        setFetchingLeaderBoard(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`)
            const data = await res.json();

            console.log("THE STUFF", data)

            setLeaderBoardData(data.body.data);

        } catch (error) {
            console.log("Error", error)
        } finally{
            setFetchingLeaderBoard(false)
        }
    }

    fetchLeaderBoard()
  },[])
   
  return (
    <div className={styles.main__container}>
        <div>
            <p>LEADERBOARD</p>
        </div>

        <div>
            {
                fetchingLeaderBoard? <FetchingLoader /> : (
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team Name</th>
                        <th>Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderBoardData?.map((team: T_TeamDisplay, index : number) => (
                        <tr key={team.teamId}>
                            <td>{index + 1}</td>
                            <td>{team.teamName}</td>
                            <td>{team.currentQuestionStage === -1 ? 'COMPLETED' : team.currentQuestionStage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                )
            }
        </div>
        
    </div>
  )
}

export default LeaderBoard