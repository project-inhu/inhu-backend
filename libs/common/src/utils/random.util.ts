export const pickRandomValue = <T extends Record<string, any>>(
  obj: T,
): T[keyof T] => {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return obj[randomKey];
};
