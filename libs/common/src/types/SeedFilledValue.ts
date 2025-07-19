type NotNill<T> = T extends undefined ? never : T;

type Primitive = undefined | boolean | string | number | Function | Date;

/**
 * 타입에서 ?, undefined를 제거
 * 타입에 null이 섞여있을 경우 타입을 null로 고정
 *
 * @author jochongs
 */
export type FilledSeed<T> = T extends Primitive
  ? NotNill<T>
  : {
      [P in keyof T]-?: T[P] extends Array<infer U>
        ? Array<FilledSeed<U>>
        : T[P] extends ReadonlyArray<infer U2>
          ? FilledSeed<U2>
          : FilledSeed<T[P]>;
    };
