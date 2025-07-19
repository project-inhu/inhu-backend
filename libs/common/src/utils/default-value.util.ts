export function defaultValue<T>(value: T | undefined, defaultValue: T): T {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}
