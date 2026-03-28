import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../_config/connectDb";
import { LoginSchema } from "../../_validation/user.validation";
import Team from "../../_model/team.model";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const LoginVerified = LoginSchema.safeParse(body);

    if (!LoginVerified.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid login data provided",
        body: { message: "Invalid login data" },
      });
    }

    const { teamId } = LoginVerified.data;

    const team = await Team.findOne({ teamId: teamId });

    if (!team) {
      return NextResponse.json(
        {},
        {
          status: 401,
          statusText: "Team not found",
        },
      );
    }

    if (team.isDisqualified || team.numberOfLives <= 0) {
      return NextResponse.json(
        {
          data: {
            teamId: team.teamId,
          },
        },
        {
          status: 302,
          statusText: "disqualified",
        },
      );
    }

    if (team.currentQuestionStage === -1) {
      return NextResponse.json(
        {
          data: {
            teamId: team.teamId,
          },
        },
        {
          status: 302,
          statusText: "Completed",
        },
      );
    }

    const getNextQuestionId = (stage: number) => {
      if (stage <= 0 || stage > team.spotArray.length) return "";
      return team.spotArray[stage - 1] ?? "";
    };

    await createSession({
      teamId: teamId,
    });

    if (!team.isLoggedIn) {
      team.isLoggedIn = true;
      await team.save();
      return NextResponse.json(
        {
          data: {
            teamName: team.teamName,
            teamId: team.teamId,
            currentQuestionStage: Number(team.currentQuestionStage),
            numberOfLives: Number(team.numberOfLives),
            hasPaid: team.hasPaid,
            isLoggedIn: false,
            nextQuestionId: getNextQuestionId(team.currentQuestionStage),
          },
        },
        {
          status: 200,
          statusText: "Successfull",
        },
      );
    } else {
      return NextResponse.json(
        {
          data: {
            teamName: team.teamName,
            teamId: team.teamId,
            currentQuestionStage: Number(team.currentQuestionStage),
            numberOfLives: Number(team.numberOfLives),
            hasPaid: team.hasPaid,
            isLoggedIn: team.isLoggedIn,
            nextQuestionId: getNextQuestionId(team.currentQuestionStage),
          },
        },
        {
          status: 200,
          statusText: "Successfull",
        },
      );
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
}
