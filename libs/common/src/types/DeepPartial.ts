/**
 * DeepPartial 타입은 주어진 타입 T의 모든 속성을 선택적으로 포함하는 타입을 정의합니다.
 *
 * @publicApi
 */

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
