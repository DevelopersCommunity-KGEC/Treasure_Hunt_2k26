import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/app/api/_config/connectDb';
import Question from '../_model/question.model';
import { QuestionSchema } from '../_validation/question.validation';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const result= await Question.find({})

    return NextResponse.json({
      message: 'fetched all questions',
      success : true,
      data : result,
    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred while processing your request.',
      description: JSON.stringify(error),
    });
  }
}

export async function POST(req: NextRequest) {

    const body = await req.json();

    const QuestionVerified = QuestionSchema.safeParse(body);

    if(!QuestionVerified.success) {
        return NextResponse.json({
            success: false,
            zodErrorBody: QuestionVerified.error? QuestionVerified.error : null,
            message: 'Invalid request body',
            body: JSON.stringify(QuestionVerified),
        })
    }
    
    try {
        await connectDB();
        const res = await  Question.create({
            question: QuestionVerified.data.question,
            questionImage: QuestionVerified.data.questionImage,
            questionId: QuestionVerified.data.questionId,
            spotName: QuestionVerified.data.spotName,
            answerCode: QuestionVerified.data.answerCode
        })
        
        return NextResponse.json({
            message: 'Question added successfully',
            data: res,
        })
        
    } catch (error) {
        return NextResponse.json({
        message: 'An error occurred while processing your request.',
        description: JSON.stringify(error),
        });
    }
}

export async function DELETE() {
  try {
    await connectDB();
    await Question.deleteMany({});
    return NextResponse.json({ message: 'All questions deleted successfully' });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred while processing your request.',
      description: JSON.stringify(error),
    });
  }
}