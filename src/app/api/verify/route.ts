import { NextResponse, NextRequest } from "next/server";
import connectDB from "../_config/connectDb"
import { z } from "zod";
import Team from "../_model/team.model";
import Question from "../_model/question.model";

const VerifySchema = z.object({
    teamId : z.string({
        message: 'Team id must be a string'
    }),
    questionId : z.string().max(10,{
        message: 'Question id must be a string with maximum length of 10'
    }),
    answerCode : z.string().max(10, {
        message: 'Answer code must be a string with maximum length of 7'
    }),
})

export async function POST(req : NextRequest) {
    try {
        await connectDB();

        const body= await req.json();

        const verifyBody = VerifySchema.safeParse(body);

        if(!verifyBody.success) {
            return NextResponse.json({
                success : false,
                message: verifyBody.error,
                zodErrorBody : verifyBody.error ?verifyBody.error : null,
                body: JSON.stringify(verifyBody.error),
            })
        }

        const { teamId, questionId, answerCode } = verifyBody.data;

        const team = await Team.findOne({
            teamId: teamId,
        })

        if(!team) {
            return NextResponse.json({
                success : false,
                message: 'Team not found',
                body: JSON.stringify({ message: "Team not found" }),
            })
        }

        const question = await Question.findOne({
            questionId
        })

        if(!question) {
            return NextResponse.json({
                success : false,
                message: 'Question not found',
                body: JSON.stringify({ message: "Question not found" }),
            })
        }
        
        if(team.isDisqualified) {
            return NextResponse.json({
                success : false,
                message: 'Team is disqualified',
                body: {
                    numberOfLives: team.numberOfLives,
                    currentQuestionStage: team.currentQuestionStage,
                    isDisqualified : team.isDisqualified,
                    nextQuestionId : team.spotArray[team.currentQuestionStage - 1],
                },
            })
        }

        if (question.answerCode !== answerCode) {

            if(team.numberOfLives === 0) {
                team.isDisqualified = true;
                await team.save();

                return NextResponse.json({
                    success: false,
                    message: 'Incorrect answer code',
                    body: { numberOfLives: team.numberOfLives, currentQuestionStage: team.currentQuestionStage, 
                    isDisqualified : team.isDisqualified,                 
                    nextQuestionId : team.spotArray[team.currentQuestionStage - 1],
 },
                }, {
                    status : 200
            })
            }
            
            team.numberOfLives -= 1;
            await team.save();

            return NextResponse.json({
                success: false,
                message: 'Incorrect answer code',
                body: { numberOfLives: team.numberOfLives, currentQuestionStage: team.currentQuestionStage, isDisqualified : team.isDisqualified ,                 
                nextQuestionId : team.spotArray[team.currentQuestionStage - 1],
},
            }, {
                status : 200
            });
        }

        const totalQuestions = team.spotArray.length;
        team.progressString += answerCode + '_';
        team.currentQuestionStage = team.currentQuestionStage + 1 > totalQuestions ? -1 : team.currentQuestionStage + 1;
        team.lastStageUpdate = new Date();

        await team.save();

        return NextResponse.json({
            success: true,
            message: 'Answer code verified',
            body: {
                numberOfLives: team.numberOfLives,
                currentQuestionStage: team.currentQuestionStage,
                isDisqualified: team.isDisqualified,
                nextQuestionId : team.currentQuestionStage === -1 ? '' : team.spotArray[team.currentQuestionStage - 1],
            },
        }, {
            status: 200
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred while processing your request.',
            body: JSON.stringify({ message: "Internal Server Error" }),
        })
    }
}