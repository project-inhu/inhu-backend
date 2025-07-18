/**
 * seed helper의 추상 클래스
 *
 * @author 조희주
 */
export abstract class SeedHelper<T> {
  abstract seed(input?: Partial<T>): Promise<T>;
}
