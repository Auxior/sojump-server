import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  private _getRadioOptText(value, props: any = {}) {
    const { options = [] } = props;
    const length = options.length;

    for (let i = 0; i < length; i++) {
      const item = options[i];
      if (item.value === value) {
        return item.text;
        break;
      }
    }
    return '';
  }

  private _getCheckboxOptText(value, props: any = {}) {
    const { list = [] } = props;
    const length = list.length;

    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (item.value === value) {
        return item.text;
        break;
      }
    }
    return '';
  }

  /**
   * 生成答案信息，格式如 { componentFeId1: value1, componentFeId2: value2 }
   * @param {Object} question question info
   * @param {Array} answerList answer list
   */
  private _genAnswersInfo(question, answerList = []) {
    const res = {};

    const { componentList = [] } = question;

    answerList.forEach((a) => {
      const { componentFeId, value = [] } = a;

      // 获取组件信息
      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
      const { type, props = {} } = comp;
      if (type === 'questionRadio') {
        // 单选
        res[componentFeId] = value
          .map((v) => this._getRadioOptText(v, props))
          .toString();
      } else if (type === 'questionCheckbox') {
        // 多选
        res[componentFeId] = value
          .map((v) => this._getCheckboxOptText(v, props))
          .toString();
      } else {
        // 其他
        res[componentFeId] = value.toString();
      }
    });

    return res;
  }

  // 获取单个问卷的答卷列表 (分页) 和数量
  async getQuestionStatListAndCount(
    questionId: string,
    opt: { page: number; pageSize: number },
  ) {
    const noData = { list: [], count: 0 };
    if (!questionId) return noData;

    const q = await this.questionService.findOne(questionId);
    if (q == null) return noData;

    const total = await this.answerService.count(questionId);
    if (total === 0) return noData;

    const answers = await this.answerService.findAll(questionId, opt);

    const list = answers.map((a) => {
      return {
        _id: a._id,
        ...this._genAnswersInfo(q, a.answerList),
      };
    });

    return {
      list,
      total,
    };
  }
}
