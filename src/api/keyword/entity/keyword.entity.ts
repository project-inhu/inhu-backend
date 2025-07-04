export class KeywordEntity {
  /**
   * keyword idx
   * @example 1
   */
  idx: number;

  /**
   * keyword 내용
   * @example "인테리어가 예뻐요"
   */
  content: string;

  /**
   * 키워드 생성 날짜
   * @example "2024-03-11T12:34:56.789Z"
   */
  createdAt: Date;

  constructor(data: KeywordEntity) {
    Object.assign(this, data);
  }
}
