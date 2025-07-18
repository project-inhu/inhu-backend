import { SelectKeyword } from './prisma-type/select-keyword';

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
