import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../_config/connectDb";
import Team from "../../_model/team.model";

export async function GET(req : NextRequest, {params} : {params : {teamId : string}}) {
    try {
        await connectDB();
        const teamId = params.teamId;

        const res = await Team.findOne({
            teamId: teamId,
        })

        if(res){
        return NextResponse.json({
            message: 'Team retrieved successfully',
            data: {
                teamId : res.teamId,
                hasPaid : res.hasPaid,
                numberOfLives : res.numberOfLives,
                currentQuestionStage : res.currentQuestionStage,
                isDisqualified : res.isDisqualified,
                nextQuestionId: res.currentQuestionStage < 0 ? '' : res.spotArray[res.currentQuestionStage - 1],
            },
        })}else {
            return NextResponse.json({},{
                status: 404,
                statusText:'Team not found'
            });
        }
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'An error occurred while processing your request.',
            body: JSON.stringify({ message: "Internal Server Error" }),
        })
    }
}

interface TeamUpdateRequest {
    teamName?: string;
    numberOfLives?: number;
    progressString?: string;
    validationString?: string;
    currentQuestionStage?: number;
    isDisqualified?: boolean;
    teamMembers?: {
        name: string;
        espektroId: string;
    }[];
}

export async function PUT(req: NextRequest, { params }: { params: { teamId: string } }) {
    try {
        await connectDB();

        const teamId = params.teamId;
        const body = await req.json();


        const updateFields: Partial<TeamUpdateRequest> = {};
        if (body.teamName) updateFields['teamName'] = body.teamName;
        if (body.numberOfLives !== undefined) updateFields['numberOfLives'] = body.numberOfLives;
        if (body.progressString) updateFields['progressString'] = body.progressString;
        if (body.validationString) updateFields['validationString'] = body.validationString;
        if (body.currentQuestionStage !== undefined) updateFields['currentQuestionStage'] = body.currentQuestionStage;
        if (body.isDisqualified !== undefined) updateFields['isDisqualified'] = body.isDisqualified;
        if (body.teamMembers) updateFields['teamMembers'] = body.teamMembers;

        const updatedTeam = await Team.findOneAndUpdate(
            { teamId: teamId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedTeam) {
            return NextResponse.json({
                status: 404,
                message: 'Team not found.',
            });
        }

        return NextResponse.json({
            message: 'Team updated successfully',
            data: updatedTeam,
        });
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'An error occurred while processing your request.',
            body: JSON.stringify({ message: "Internal Server Error" }),
        });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { teamId: string } }) {
    try {
        await connectDB();
        await Team.deleteOne({
            teamId : params.teamId,
        });
        return NextResponse.json({
            message: 'Team deleted successfully',
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'An error occurred while processing your request.',
            body: JSON.stringify({ message: "Internal Server Error" }),
        });
    }
}