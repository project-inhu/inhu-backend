type NotNill<T> = T extends undefined ? never : T;

type Primitive = undefined | null | boolean | string | number | Function;

/**
 * 타입에서 ?, undefined를 제거하는 유틸리티 타입
 *
 * @author jochongs
 */
export type DeepRequired<T> = T extends Primitive
  ? NotNill<T>
  : {
      [P in keyof T]-?: T[P] extends Array<infer U>
        ? Array<DeepRequired<U>>
        : T[P] extends ReadonlyArray<infer U2>
          ? DeepRequired<U2>
          : DeepRequired<T[P]>;
    };
