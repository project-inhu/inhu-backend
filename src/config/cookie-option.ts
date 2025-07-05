import { CookieOptions } from 'express';

export const devCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};
