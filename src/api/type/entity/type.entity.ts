export class TypeEntity {
  /**
   * type idx
   * @example 1
   */
  idx: number;

  /**
   * type 내용
   * @example "카페"
   */
  content: string;

  constructor(data: TypeEntity) {
    Object.assign(this, data);
  }
}
