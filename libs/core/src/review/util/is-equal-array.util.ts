/**
 * 두 배열이 같은지 비교합니다.
 * 두 배열의 길이가 다르면 false를 반환하고,
 * 길이가 같으면 각 요소를 정렬한 후 비교하여 동일한지 확인합니다.
 *
 * @publicApi
 */
export const isEqualArray = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};
