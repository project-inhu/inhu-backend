/**
 * 쿠키 값을 Set-Cookie 헤더에서 추출합니다.
 *
 * @publicApi
 */
export const extractCookieValueFromSetCookieHeader = (
  setCookieHeader: string,
  cookieName: string,
): string | null => {
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  const match = setCookieHeader.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
};
