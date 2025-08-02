import { SelectKeyword } from './prisma-type/select-keyword';

/**
 * 키워드 모델 클래스
 *
 * @publicApi
 */
export class KeywordModel {
  public idx: number;
  public name: string;

  constructor(data: KeywordModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(keyword: SelectKeyword): KeywordModel {
    return new KeywordModel({
      idx: keyword.idx,
      name: keyword.content,
    });
  }
}
