import Team from "@/app/api/_model/team.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest, {params} : {params : {teamId : string}}) {
    try {

        const teamId = params.teamId;

        const team = await Team.findOneAndUpdate({teamId},{
            isLoggedIn : false
        })

        if(team) {
            return NextResponse.json({},{
                status : 200,
                statusText : 'Successfully logged out'
            })
        }
        
    } catch (error) {
        console.log('Error',error);
        return NextResponse.json({},{
            status : 500,
            statusText: 'We are very sorry for the inconvienience'
        })
    }
}