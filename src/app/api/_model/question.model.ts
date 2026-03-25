import mongoose, { model, Model, Schema, models, InferSchemaType } from 'mongoose';

const questionSchema = new Schema(
  {
    question: {
      type: String,
      default: ''
    },
    questionImage: {
      type: String,
      default: ''
    },
    questionId: {
      type: String,
      required: true,
    },
    spotName: {
      type: String,
      required: true,
    },
    answerCode: {
        type: String,
        required: true,
    },
    hint: {
      type : String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

export type QuestionModelSchemaType = InferSchemaType<typeof questionSchema>
export type QuestionModelSchemaTypeWithId = QuestionModelSchemaType & {
  _id: Schema.Types.ObjectId;
};

const Question: Model<QuestionModelSchemaType> =
  models.Question ?? model<QuestionModelSchemaType>('Question', questionSchema);
  
export default Question;