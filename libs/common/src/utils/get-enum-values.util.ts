/**
 * enum의 숫자 값만 추출하는 함수
 *
 * @author 이수인
 * @publicApi
 */
export const getEnumValues = <T extends Record<string, any>>(
  obj: T,
): T[keyof T][] => {
  return Object.keys(obj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => obj[key]);
};
