import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schema/answer.schema';

@Injectable()
export class AnswerService {
  // 依赖注入
  constructor(@InjectModel(Answer.name) private readonly answerModel) {}

  async create(answerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }

    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }
}
