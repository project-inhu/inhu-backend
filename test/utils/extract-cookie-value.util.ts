export const extractCookieValue = (cookies: string, key: string): string => {
  if (Array.isArray(cookies)) {
    return cookies
      .find((cookie) => cookie.startsWith(`${key}=`))
      ?.split(';')[0]
      ?.split('=')[1];
  }
  return '';
};
