/**
 * 주어진 값이 undefined인 경우 기본값을 반환합니다.
 *
 * @publicApi
 */

export function defaultValue<T>(value: T | undefined, defaultValue: T): T {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}
