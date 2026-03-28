import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import Team from "../_model/team.model";

const RequestSchema = z.object({
    answer : z.string(),
    teamId: z.string()
})

export async function POST(req : NextRequest) {
    try {

        const body = await req.json();

        const verifyBody = RequestSchema.safeParse(body);

        if(!verifyBody.success) {
            return NextResponse.json({
                success : false,
                zodErrorBody : verifyBody.error ?verifyBody.error : null,
                message: 'Invalid request body',
                body: JSON.stringify(verifyBody),
            },{
                status : 400
            })
        }

        if(verifyBody.data?.answer.toLowerCase() !== 'labyrinth') {
            return NextResponse.json({
                success : false,
                message: 'Access denied',
                body: JSON.stringify({ message: "Access denied" }),
            },{
                status : 400
            })
        }

        const {teamId} = body;

        const team = await Team.findOne({
            teamId
        });

        if(!team) {
            return NextResponse.json({
                success : false,
                message: 'Team not found',
                body: JSON.stringify({ message: "Team not found" }),
            },{
                status: 400
            })
        }

        team.progressString = 'initialsol_';
        team.currentQuestionStage  = 1;
        team.lastStageUpdate = new Date();

        await team.save();
        
        return NextResponse.json({
                progressString: team.progressString,
                currentQuestionStage : team.currentQuestionStage,
                numberOfLives : team.numberOfLives,
                nextQuestionId : team.spotArray[team.currentQuestionStage - 1]
        },{
            status : 200,
            statusText: 'Access Granted'
        })
    } catch (error) {
        console.log("ERROR", error)
        return NextResponse.json({
            message: 'An error occurred while processing your request.',
            body: JSON.stringify({ message: "Internal Server Error" }),
        },{
            status : 500
        })
    }
}