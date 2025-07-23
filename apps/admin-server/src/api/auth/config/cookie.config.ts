import { CookieOptions } from 'express';

export const getCookieConfig = (): CookieOptions => {
  if (process.env.NODE_ENV === 'development') {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
  } else {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    };
  }
};
