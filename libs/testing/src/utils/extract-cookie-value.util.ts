export const extractCookieValueFromSetCookieHeader = (
  setCookieHeader: string,
  cookieName: string,
): string | null => {
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  const match = setCookieHeader.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
};
