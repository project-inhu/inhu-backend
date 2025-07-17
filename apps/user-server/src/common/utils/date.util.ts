/**
 * Date 객체를 'HH:mm:ss' 형식의 시간 문자열로 변환
 */
export function formatTimeFromDate(dateObject: Date): string {
  const hours = String(dateObject.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');
  const seconds = String(dateObject.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 날짜 문자열로 변환
 */
export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}
