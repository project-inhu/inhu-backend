/**
 * 주어진 객체에서 랜덤한 값을 선택합니다.
 *
 * @publicApi
 */
export const pickRandomValue = <T extends Record<string, any>>(
  obj: T,
): T[keyof T] => {
  const keys = Object.keys(obj).filter((key) => isNaN(Number(key)));
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return obj[randomKey];
};

/**
 * 범위 내의 랜덤 정수 값을 반환하는 함수
 *
 * @publicApi
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 범위 내의 개수 만큼 세 번째 파라미터 함수를 실행하여 나온 결과를 리턴하는 함수
 *
 * @publicApi
 */
export const getRandomValues = <T>(
  min: number,
  max: number,
  fn: () => T,
): T[] => {
  const count = getRandomInt(min, max);
  return Array.from({ length: count }, fn);
};
