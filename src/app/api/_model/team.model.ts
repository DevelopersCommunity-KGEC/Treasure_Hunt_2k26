import { model, Model, Schema, InferSchemaType, models } from 'mongoose';
import { deflate } from 'zlib';

const teamSchema = new Schema(
  {
    teamName : {
        type: String,
        required: true,
    },
    teamId: {
      type: String,
      required: true,
      unique: true
    },
    numberOfLives: {
      type: Number,
      default: 5,
    },
    paymentStatus:{
      type : String,
      default :''
    },
    lastPaymentDate : {
      type : String,
      default : ''
    },
    lastCaptureDate : {
      type : String,
      default : ''
    },
    lastFailedPaymentDate: {
      type : String,
      default : ''
    },
    progressString: {
      type: String,
      default: ''
    },
    validationString: {
        type: String,
        default: ''
    },
    currentQuestionStage: {
        type: Number,
        default: 0,
    },
    lastStageUpdate:{
        type : Date,
        default: Date.now,
    },
    hasPaid : {
      type:  Boolean,
      default: false,
    },
    orderId :{
      type : String,
      default: ''
    },
    method: {
      type : String,
      default : ''
    },
    vpa: {
      type : String,
      default: ''
    },
    amount :  {
      type : Number,
      default: 0
    },
    paymentId : {
      type : String,
      default : ''
    },
    contact : {
      type : String,
      default :  ''
    },
    orderValue: {
      type : Number,
      default: 0
    },
    isDisqualified: {
        type: Boolean,
        default: false,
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    isLoggedIn: {
      type : Boolean,
      default : false
    },
    spotArray:{
      type : [String],
      default : []
    },
    hintsLeft :{
      type : Number,
      default : 3
    }
  },
  {
    timestamps: true,
  }
);

export type TeamModelSchemaType = InferSchemaType<typeof teamSchema>
export type TeamModelSchemaTypeWithId = TeamModelSchemaType & {
  _id: Schema.Types.ObjectId;
};

const Team: Model<TeamModelSchemaType> =
  models.Team ?? model<TeamModelSchemaType>('Team', teamSchema);
export default Team;