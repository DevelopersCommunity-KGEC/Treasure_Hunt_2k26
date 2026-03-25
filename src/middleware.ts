import { NextRequest, NextResponse } from "next/server"
import { verifySession } from "./lib/session";

export async function middleware(request :  NextRequest){

    const response = NextResponse.next();

    // const cookie = await verifySession();

    // if(!cookie?.data) {
    //     return NextResponse.redirect(new URL('/auth/login', request.url));
    // }

    // const questionId = request.nextUrl.pathname.split('/')[3]
    // const teamId = (cookie?.data as { teamId: string }).teamId;

    // const team = await api.get(`/team/${teamId}`)
    // const teamData= team.data;
    // const currentTeamStage = teamData.data.currentQuestionStage;
    // const stageId = `q${teamData.data.currentQuestionStage}`

    // if(request.nextUrl.pathname.split('/')[1] === 'startup') {
    //     if(teamData.data.currentQuestionStage !== 0)
    //       return NextResponse.redirect(new URL(`/${teamId}/question/q${teamData.data.currentQuestionStage}`, request.url));
    //     else if(teamData.data.currentQuestionStage === -
    // const teamData= team.data;
    // const currentTeamStage = teamData.data.currentQuestionStage;
    // const stageId = `q${teamData.data.currentQuestionStage}`

    // if(request.nextUrl.pathname.split('/')[1] === 'startup') {
    //     if(teamData.data.currentQuestionStage !== 0)
    //       return NextResponse.redirect(new URL(`/${teamId}/question/q${teamData.data.currentQuestionStage}`, request.url));
    //     else if(teamData.data.currentQuestionStage === -1){
    //         return NextResponse.redirect(new URL('/complete', request.url));
    //     }
    // }
    // else {
    //     if(teamData.data.currentQuestionStage === -1) {
    //         return NextResponse.redirect(new URL('/complete', request.url));
    //     }
        
    //     if(teamData.data.isDisqualified || teamData.data.numberOfLives === -1){
    //         return NextResponse.redirect(new URL('/dead', request.url));
    //     }

    //     if(currentTeamStage === null){
    //         return NextResponse.redirect(new URL('/auth/login', request.url));
    //     }
    //     else if(stageId !== questionId){
    //         if(teamData.data.currentQuestionStage === 0){
    //             return NextResponse.redirect(new URL('/startup', request.url));
    //         }
    //     }  
    // }
    return response;
}

// export const config = {
//     matcher: ['/((?!api).*)/question/q([1-6])','/startup'],
// }