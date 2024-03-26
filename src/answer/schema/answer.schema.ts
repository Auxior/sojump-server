import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop({ required: true })
  questionId: string; // 对应问卷的 _id

  @Prop()
  answerList: {
    componentFeId: string; // 对应组件的 fe_id
    value: string[];
  }[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
