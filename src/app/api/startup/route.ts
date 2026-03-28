import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import Team from "../_model/team.model";
import connectDB from "../_config/connectDb";

const RequestSchema = z.object({
  answer: z.string(),
  teamId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const verifyBody = RequestSchema.safeParse(body);

    if (!verifyBody.success) {
      return NextResponse.json(
        {
          success: false,
          zodErrorBody: verifyBody.error ? verifyBody.error : null,
          message: "Invalid request body",
          body: JSON.stringify(verifyBody),
        },
        {
          status: 400,
        },
      );
    }

    if (verifyBody.data?.answer.toLowerCase() !== "abcd") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
          body: JSON.stringify({ message: "Access denied" }),
        },
        {
          status: 400,
        },
      );
    }

    const { teamId } = verifyBody.data;

    const team = await Team.findOne({
      teamId,
    });

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
          body: JSON.stringify({ message: "Team not found" }),
        },
        {
          status: 400,
        },
      );
    }

    const getNextQuestionId = (stage: number) => {
      if (stage <= 0 || stage > team.spotArray.length) return "";
      return team.spotArray[stage - 1] ?? "";
    };

    if (team.isDisqualified || team.numberOfLives <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Team is disqualified",
          body: {
            numberOfLives: team.numberOfLives,
            currentQuestionStage: team.currentQuestionStage,
            isDisqualified: true,
            nextQuestionId: getNextQuestionId(team.currentQuestionStage),
          },
        },
        {
          status: 403,
        },
      );
    }

    if (team.currentQuestionStage === -1) {
      return NextResponse.json(
        {
          success: true,
          message: "Hunt already completed",
          progressString: team.progressString,
          currentQuestionStage: team.currentQuestionStage,
          numberOfLives: team.numberOfLives,
          nextQuestionId: "",
        },
        {
          status: 200,
        },
      );
    }

    if (team.currentQuestionStage > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Hunt already started",
          progressString: team.progressString,
          currentQuestionStage: team.currentQuestionStage,
          numberOfLives: team.numberOfLives,
          nextQuestionId: getNextQuestionId(team.currentQuestionStage),
        },
        {
          status: 200,
        },
      );
    }

    team.progressString = "initialsol_";
    team.currentQuestionStage = 1;
    team.lastStageUpdate = new Date();

    await team.save();

    return NextResponse.json(
      {
        progressString: team.progressString,
        currentQuestionStage: team.currentQuestionStage,
        numberOfLives: team.numberOfLives,
        nextQuestionId: getNextQuestionId(team.currentQuestionStage),
      },
      {
        status: 200,
        statusText: "Access Granted",
      },
    );
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        body: JSON.stringify({ message: "Internal Server Error" }),
      },
      {
        status: 500,
      },
    );
  }
}
