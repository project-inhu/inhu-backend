import { KeywordModel } from '@libs/core/keyword/model/keyword.model';

export class KeywordEntity {
  /**
   * keyword 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * keyword 이름
   *
   * @example "🎀 인테리어가 예뻐요"
   */
  public content: string;

  constructor(data: KeywordEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: KeywordModel): KeywordEntity {
    return new KeywordEntity({
      idx: model.idx,
      content: model.name,
    });
  }
}
