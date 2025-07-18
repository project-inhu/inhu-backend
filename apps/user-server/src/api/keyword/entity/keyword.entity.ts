import { KeywordModel } from '@app/core';

export class KeywordEntity {
  /**
   * keyword idx
   *
   * @example 1
   */
  idx: number;

  /**
   * keyword 내용
   *
   * @example "인테리어가 예뻐요"
   */
  content: string;

  constructor(data: KeywordEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: KeywordModel) {
    return new KeywordEntity({
      idx: model.idx,
      content: model.name,
    });
  }
}
