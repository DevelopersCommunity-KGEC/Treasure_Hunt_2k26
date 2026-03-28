'use client';

import React, { useEffect, useState } from 'react'

import styles from './style.module.scss';
// import { useGetLeaderboard } from '@/query/api/user.service';
import FetchingLoader from '@/components/FetchingLoader/FetchingLoader';

type T_TeamDisplay = {
    teamName: string,
    teamId: string,
    currentQuestionStage: number,
    lastStageUpdate: string,
    teamMembers: string[],
    numberOfLives: number,
    isDisqualified: boolean,
    hasPaid: boolean,
    createdAt: string,
    updatedAt: string,
}

const LeaderBoard = () => {

    const [fetchingLeaderBoard, setFetchingLeaderBoard] = useState(false);
    const [leaderBoardData, setLeaderBoardData] = useState<T_TeamDisplay[]>([]);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

    //   const getLeaderBoard = useGetLeaderboard();
    useEffect(() => {
        const fetchLeaderBoard = async () => {
            setFetchingLeaderBoard(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`)
                const data = await res.json();

                console.log("THE STUFF", data)

                setLeaderBoardData(data.body.data);

            } catch (error) {
                console.log("Error", error)
            } finally {
                setFetchingLeaderBoard(false)
            }
        }

        fetchLeaderBoard()
    }, [])

    const formatTime = (value?: string) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString();
    }

    const getStageLabel = (stage: number) => {
        if (stage === -1) return 'COMPLETED';
        if (stage === 0) return 'STARTUP';
        return `Stage ${stage}`;
    }

    return (
        <div className={styles.main__container}>
            <div>
                <p>LEADERBOARD</p>
            </div>

            <div className={styles.leaderboard__container}>
                {
                    fetchingLeaderBoard ? <FetchingLoader /> : (
                        <div className={styles.accordion__list}>
                            {leaderBoardData?.map((team: T_TeamDisplay, index: number) => {
                                const isOpen = expandedTeamId === team.teamId;

                                return (
                                    <div key={team.teamId} className={styles.accordion__item}>
                                        <button
                                            className={styles.accordion__trigger}
                                            onClick={() => setExpandedTeamId(isOpen ? null : team.teamId)}
                                            type='button'
                                        >
                                            <div className={styles.summary__left}>
                                                <span className={styles.rank}>#{index + 1}</span>
                                                <span className={styles.team__name}>{team.teamName}</span>
                                            </div>
                                            <div className={styles.summary__right}>
                                                <span>{getStageLabel(team.currentQuestionStage)}</span>
                                                <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className={styles.accordion__content}>
                                                <div className={styles.info__grid}>
                                                    <p><strong>Team ID:</strong> {team.teamId}</p>
                                                    <p><strong>Lives Left:</strong> {team.numberOfLives}</p>
                                                    <p><strong>Paid:</strong> {team.hasPaid ? 'Yes' : 'No'}</p>
                                                    <p><strong>Disqualified:</strong> {team.isDisqualified ? 'Yes' : 'No'}</p>
                                                    <p><strong>Last Stage Update:</strong> {formatTime(team.lastStageUpdate)}</p>
                                                    <p><strong>Created At:</strong> {formatTime(team.createdAt)}</p>
                                                    <p><strong>Updated At:</strong> {formatTime(team.updatedAt)}</p>
                                                </div>

                                                <div className={styles.members__section}>
                                                    <p><strong>Team Members</strong></p>
                                                    <ul>
                                                        {team.teamMembers?.map((member, memberIndex) => (
                                                            <li key={`${team.teamId}-${memberIndex}`}>{member}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {leaderBoardData.length === 0 && (
                                <p className={styles.empty__state}>No teams found</p>
                            )}
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default LeaderBoard