/**
 * 생성자 함수의 별칭을 입력합니다.
 *
 * @publicApi
 */

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
