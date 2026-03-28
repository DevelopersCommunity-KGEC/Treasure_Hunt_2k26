import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../_config/connectDb";
import Question from "../../_model/question.model";
import { QuestionSchema } from "../../_validation/question.validation";
import Team from "../../_model/team.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const questionId = params.id;

    const hintParam = req.nextUrl.searchParams.get("hint");
    const teamId = req.nextUrl.searchParams.get("teamId");

    const result = await Question.findOne({
      questionId,
    });

    if (!result) {
      return NextResponse.json(
        {
          message: "Question not found",
        },
        {
          status: 404,
        },
      );
    }

    let hint = "";

    if (hintParam === "true") {
      if (!teamId) {
        return NextResponse.json(
          {
            message: "teamId is required for hint",
          },
          { status: 400 },
        );
      }

      const team = await Team.findOne({ teamId: teamId });

      console.log("Hint param is true", team);

      if (team) {
        hint =
          team?.hintsLeft! > 0 ? (result?.hint ?? "") : "No more hints left!!";
        if (team.hintsLeft > 0) {
          team.hintsLeft -= 1;
        }
        await team.save();

        return NextResponse.json(
          {
            hint,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          message: "Team not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        description: JSON.stringify(error),
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const questionId = params.id;

    const body = await req.json();

    const { success, error } = await QuestionSchema.partial().safeParse(body);

    if (!success) {
      return NextResponse.json({
        message: "Invalid data",
      });
    }

    const res = await Question.findOneAndUpdate(
      {
        questionId: questionId,
      },
      {
        $set: body,
      },
      {
        returnOriginal: false,
      },
    );

    return NextResponse.json({
      message: "Question updated successfully",
      data: res,
    });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while processing your request.",
      description: JSON.stringify(error),
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const questionId = params.id;

    const res = await Question.findOneAndDelete({
      questionId: questionId,
    });

    return NextResponse.json({
      message: "Question deleted successfully",
      data: res,
    });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while processing your request.",
      description: JSON.stringify(error),
    });
  }
}
